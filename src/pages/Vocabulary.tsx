import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Typography, Modal, Upload, Input, Form, message, Progress as AntProgress, Space, Popconfirm } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

interface VocabularyItem {
  id: string;
  name: string;
  word_count: number;
  progress: number;
  created_at: string;
}

export default function Vocabulary() {
  const { user } = useAuth();
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchVocabularies = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('vocabularies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVocabularies(data || []);
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      message.error('获取词库列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabularies();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vocabularies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      message.success('词库已删除');
      fetchVocabularies();
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      message.error('删除失败');
    }
  };

  const handleImport = async (values: any) => {
    if (!user) return;
    const { name, file } = values;
    const originFileObj = file[0].originFileObj;

    setImportLoading(true);

    try {
      // 1. Create Vocabulary
      const { data: vocabData, error: vocabError } = await supabase
        .from('vocabularies')
        .insert([{
          user_id: user.id,
          name: name,
          word_count: 0,
          progress: 0
        }])
        .select()
        .single();

      if (vocabError) throw vocabError;
      const vocabId = vocabData.id;

      // 2. Read Excel
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (jsonData.length === 0) {
            throw new Error('Excel文件为空');
          }

          // 3. Prepare words data
          // Assume columns: word, meaning, phonetic, example, translation, root_affix
          // Or map loosely
          const wordsToInsert = jsonData.map((row: any) => ({
            vocabulary_id: vocabId,
            word: row['单词'] || row['word'] || row['Word'] || '',
            meaning: row['释义'] || row['meaning'] || row['Meaning'] || '',
            phonetic: row['音标'] || row['phonetic'] || row['Phonetic'] || '',
            example: row['例句'] || row['example'] || row['Example'] || '',
            example_translation: row['例句翻译'] || row['translation'] || row['Translation'] || '',
            etymology: row['词根词缀'] || row['root'] || row['etymology'] || ''
          })).filter(w => w.word && w.meaning); // Filter out invalid rows

          if (wordsToInsert.length === 0) {
            throw new Error('未找到有效单词数据，请检查Excel表头');
          }

          // 4. Insert words (batch)
          const { error: wordsError } = await supabase
            .from('words')
            .insert(wordsToInsert);

          if (wordsError) throw wordsError;

          // 5. Update vocabulary word count
          await supabase
            .from('vocabularies')
            .update({ word_count: wordsToInsert.length })
            .eq('id', vocabId);

          message.success(`成功导入 ${wordsToInsert.length} 个单词`);
          setIsModalVisible(false);
          form.resetFields();
          fetchVocabularies();
        } catch (err: any) {
          console.error('Parse error:', err);
          message.error('解析或导入失败: ' + err.message);
          // Cleanup empty vocabulary if failed
          await supabase.from('vocabularies').delete().eq('id', vocabId);
        } finally {
          setImportLoading(false);
        }
      };
      reader.readAsBinaryString(originFileObj);

    } catch (error: any) {
      console.error('Import error:', error);
      message.error('创建词库失败: ' + error.message);
      setImportLoading(false);
    }
  };

  const columns = [
    {
      title: '词库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium"><BookOutlined className="mr-2" />{text}</span>,
    },
    {
      title: '单词数量',
      dataIndex: 'word_count',
      key: 'word_count',
    },
    {
      title: '学习进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <AntProgress percent={Math.round(progress * 100)} size="small" />,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: VocabularyItem) => (
        <Space size="middle">
          <Popconfirm title="确定要删除这个词库吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>词库管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          size="large"
        >
          导入新词库
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={vocabularies} 
          rowKey="id" 
          loading={loading}
          locale={{ emptyText: '暂无词库，请点击右上角导入' }}
        />
      </Card>

      <Modal
        title="导入Excel词库"
        open={isModalVisible}
        onCancel={() => !importLoading && setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleImport}
        >
          <Form.Item
            name="name"
            label="词库名称"
            rules={[{ required: true, message: '请输入词库名称' }]}
          >
            <Input placeholder="例如：四级核心词汇" />
          </Form.Item>

          <Form.Item
            name="file"
            label="Excel文件"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传Excel文件' }]}
          >
            <Upload 
              beforeUpload={() => false} 
              maxCount={1}
              accept=".xlsx,.xls"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
          
          <div className="mb-4 text-gray-500 text-sm">
            <p>Excel文件需包含表头，推荐列名：</p>
            <p>word (单词), meaning (释义), phonetic (音标), example (例句)</p>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={importLoading}>
              开始导入
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
