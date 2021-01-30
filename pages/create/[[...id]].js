import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import { Row, Form, Input, Button, Col, Space, InputNumber, Select, Upload, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { imageUpload } from '../../utils/imageUpload';
import { postData, getData, putData } from '../../utils/fetchData';
import { useRouter } from 'next/router';
import uuid from 'react-uuid';

const { Option } = Select;

const ProductsManager = () => {
  const initialState = {
    title: '',
    price: 0,
    inStock: 0,
    description: '',
    content: '',
    category: '',
  };

  const [product, setProduct] = useState(initialState);
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  const { title, price, inStock, description, content, category } = product;

  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleChangePriceInput = (e) => {
    setProduct({ ...product, price: e });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleChangeInStockInput = (e) => {
    setProduct({ ...product, inStock: e });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleChangeCategoryInput = (e) => {
    setProduct({ ...product, category: e });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || URL.createObjectURL(file.originFileObj));
    setPreviewVisible(true);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    dispatch({ type: 'NOTIFY', payload: {} });

    if (Array.isArray(e)) {
      return e;
    }

    e.fileList = e.fileList.slice(-5);

    const result = e.fileList.map((item) => {
      if (item.url) {
        return item;
      } else {
        return item.originFileObj;
      }
    });

    setImages(result);

    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      dispatch({ type: 'NOTIFY', payload: { error: 'You can only upload JPG/PNG file!' } });
    }

    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      dispatch({ type: 'NOTIFY', payload: { error: 'Image must smaller than 1MB!' } });
    }

    dispatch({ type: 'NOTIFY', payload: {} });
    return isJpgOrPng && isLt1M;
  };

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        const imagesArr = [...res.product.images];
        imagesArr.forEach((img) => {
          img.uid = uuid();
          img.status = 'done';
        });
        setImages(imagesArr);

        form.setFieldsValue({ ...res.product, upload: imagesArr });
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (auth.user.role !== 'admin') {
      return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not valid!' } });
    }

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === 'all' ||
      images.length === 0
    ) {
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all fields!' } });
    }

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);

    if (imgNewUrl.length > 0) {
      media = await imageUpload(imgNewUrl);
    }

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...product, images: [...imgOldUrl, ...media] },
        auth.token,
      );

      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }
    } else {
      res = await postData('product', { ...product, images: [...imgOldUrl, ...media] }, auth.token);

      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }
    }

    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Products Manager</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Form form={form} layout="vertical" style={{ width: '80%' }} onFinish={handleSubmit}>
          <Row justify="space-between">
            <Col xs={24} sm={20} md={15} xl={11} xxl={11}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input
                  name="title"
                  placeholder="Title"
                  value={title}
                  onChange={handleChangeInput}
                />
              </Form.Item>
              <Space style={{ width: '100%' }}>
                <Form.Item
                  name="price"
                  label="Price"
                  initialValue={price}
                  rules={[{ type: 'number', min: 0, required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    name="price"
                    onChange={handleChangePriceInput}
                    value={price}
                  />
                </Form.Item>
                <Form.Item
                  name="inStock"
                  label="In Stock"
                  initialValue={inStock}
                  rules={[{ type: 'number', min: 0, required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    name="inStock"
                    onChange={handleChangeInStockInput}
                    value={inStock}
                  />
                </Form.Item>
              </Space>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea
                  name="description"
                  onChange={handleChangeInput}
                  placeholder="Description"
                  value={description}
                  rows="3"
                />
              </Form.Item>
              <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                <Input.TextArea
                  name="content"
                  value={content}
                  onChange={handleChangeInput}
                  placeholder="Content"
                  rows="5"
                />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select
                  name="category"
                  placeholder="Select a Category"
                  value={category}
                  onChange={handleChangeCategoryInput}
                  allowClear>
                  <Option value="all">All Products</Option>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={20} md={15} xl={11} xxl={11}>
              <Form.Item label="Upload images">
                <Form.Item
                  name="upload"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[{ required: true }]}
                  className="upload-list-inline"
                  noStyle>
                  <Upload.Dragger
                    name="files"
                    listType="picture-card"
                    multiple={true}
                    onPreview={handlePreview}
                    beforeUpload={beforeUpload}
                    accept="image/*">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
              <Modal visible={previewVisible} width="60%" footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Col>
          </Row>
          <Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {onEdit ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Row>
    </div>
  );
};

export default ProductsManager;
