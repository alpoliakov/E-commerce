import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Select, Input } from 'antd';
import PropTypes from 'prop-types';
import filterSearch from '../utils/filterSearch';

const { Option } = Select;
const { Search } = Input;

const Filter = ({ state }) => {
  const [search, setSearch] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [sort, setSort] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState('');

  const router = useRouter();

  const { categories } = state;

  const handleCategory = (value) => {
    setCategory(value);
    filterSearch({ router, category: value });
  };

  const handleSort = (value) => {
    setSort(value);
    filterSearch({ router, sort: value });
  };

  useEffect(() => {
    filterSearch({ router, search: search ? search : 'all' });
  }, [search]);

  return (
    <div
      style={{
        margin: '20px 0 0 20px',
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
        gap: 20,
      }}>
      <Select
        name="category"
        showSearch
        style={{ width: 320 }}
        onChange={handleCategory}
        defaultValue={'all'}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        allowClear>
        <Option value="all">All Products</Option>
        {categories.map((item) => (
          <Option key={item._id} value={item._id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Search
        placeholder="input search text"
        allowClear
        style={{ width: 320 }}
        value={search.toLowerCase()}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        name="sort"
        showSearch
        onChange={handleSort}
        placeholder="Search to Sort"
        style={{ width: 320 }}
        defaultValue={'all'}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
        }
        allowClear>
        <Option value="all">Reccomend</Option>
        <Option value="-createdAt">Newest</Option>
        <Option value="oldest">Oldest</Option>
        <Option value="-sold">Best Sales</Option>
        <Option value="-price">Price: High-Low</Option>
        <Option value="price">Price: Low-High</Option>
      </Select>
    </div>
  );
};

Filter.propTypes = {
  state: PropTypes.object,
};

export default Filter;
