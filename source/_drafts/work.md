<!--
 * @Author: your name
 * @Date: 2021-07-02 17:50:44
 * @LastEditTime: 2021-07-02 17:53:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/work.md
-->

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210702175238.png"  alt="效果图" />

```typescript
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/*
 * @Author: your name
 * @Date: 2021-06-30 14:31:53
 * @LastEditTime: 2021-07-02 15:42:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fe-datahub/src/pages/TagLibrary/modules/Step2.tsx
 */

import * as React from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Form, Input, Layout, Tabs } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import globalMessages from 'utils/messages';
import { isModify } from 'utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

import messages from '../messages';
import selectors from '../selectors';
// import ButtonPicker from '../components/ButtonPicker';
import { formItemLayout, tagNameMaxLen } from '../constants';
import { Container, Category, CategoryTitle, CategoryItem, ITabs } from '../components/styled';

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { Content } = Layout;
const { TabPane } = Tabs;

interface IStep2 {
  intl: InjectedIntl;
  form: FormInstance;
}

function Step2(props: IStep2) {
  const { intl, form } = props;
  const mainModal = useSelector(selectors.mainModal);
  const [panelData, setPanelData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(-1);

  const addFunc = useRef(null);
  const { setFieldsValue, getFieldsValue, validateFields, resetFields } = form;
  const { data = {}, type = 'edit', visible = true } = mainModal;

  useEffect(() => {
    if (visible) return;
    setPanelData([]);
    setActiveCategory('');
    setActiveCategoryIdx(-1);
    resetFields();
    return () => {
      setPanelData([]);
      setActiveCategory('');
      setActiveCategoryIdx(-1);
      resetFields();
    };
  }, [visible]);

  const deleteCategory = async (index: number) => {
    const { step1 = [] } = getFieldsValue();
    const deleteInner = () => {
      if (step1.length <= 0) return;
      const newStep1 = [...step1];
      newStep1.splice(index, 1);
      panelData.splice(index, 1);
      setPanelData([...panelData]);
      setFieldsValue({ step1: newStep1 });
      setTimeout(() => {
        const newIdx = index - 1 > 0 ? index - 1 : 0;
        setActiveCategory(panelData?.[newIdx]?.name || '');
        setActiveCategoryIdx(newIdx);
      }, 0);
    };
    try {
      if (index !== step1.length - 1) {
        const values = await validateFields();
        if (!values) return;
      }
      deleteInner();
    } catch (err) {
      const { errorFields = [] } = err;
      if (errorFields.length === 0) {
        deleteInner();
      }
    }
  };

  const activeIdx = async (activeKey: string) => {
    const values = await validateFields();
    if (!values) return;
    setActiveCategory(activeKey);
    const idx = panelData.findIndex((item: any) => item.name === activeKey);
    setActiveCategoryIdx(idx);
  };

  const addCategory = async () => {
    const values = await validateFields();
    if (!values) return;
    const defaultData = { name: '请填写名称' };
    const newPanelData = [...panelData, defaultData];
    setPanelData(newPanelData);
    addFunc.current();
    setTimeout(() => {
      setActiveCategory('请填写名称');
      setActiveCategoryIdx(newPanelData.length - 1);
    }, 0);
  };

  const renderTabPane = useMemo(
    () =>
      panelData?.map?.((item: any, index: number) => (
        <TabPane
          key={item.name}
          tab={
            <CategoryItem>
              <span>{item.name}</span>
              <span onClick={() => deleteCategory(index)}>
                <DeleteOutlined />
                {intl.formatMessage(globalMessages.delete)}
              </span>
            </CategoryItem>
          }
        />
      )),
    [panelData],
  );

  const changeTagName = (e: any, index: number) => {
    panelData[index].name = e.currentTarget.value;
    setPanelData([...panelData]);
    setActiveCategory(e.currentTarget.value);
  };

  return (
    <Container>
      <Category>
        <CategoryTitle>
          <div>{intl.formatMessage(messages.categoryTitle)}</div>
          <span onClick={debounce(addCategory)}>
            <DeleteOutlined />
            &nbsp;{intl.formatMessage(globalMessages.create)}
          </span>
        </CategoryTitle>
        <ITabs tabPosition='left' activeKey={activeCategory} onTabClick={(activeKey: string) => activeIdx(activeKey)}>
          {renderTabPane}
        </ITabs>
      </Category>
      <Content style={{ margin: '0', background: '#fff', paddingTop: '15px' }}>
        <Form {...formItemLayout} form={form}>
          <Form.List name='step1'>
            {(fields, { add }) => (
              <>
                {(addFunc.current = add)}
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <>
                    {activeCategoryIdx === index && (
                      <>
                        <Form.Item
                          {...restField}
                          name={[name, 'tag_name']}
                          fieldKey={[fieldKey, 'tag_name']}
                          label={intl.formatMessage(messages.tag_name)}
                          // initialValue={data.tag_name}
                          rules={[
                            { required: true, message: intl.formatMessage(globalMessages.required) },
                            {
                              message: intl.formatMessage(globalMessages.maxCharacter, { max: tagNameMaxLen }),
                              max: tagNameMaxLen,
                            },
                            () => ({
                              validator(_: unknown, value: string) {
                                if (panelData.some((item: any, i: number) => i !== index && item.name === value)) {
                                  return Promise.reject(intl.formatMessage(messages.tag_pattern));
                                }
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.resolve();
                              },
                            }),
                          ]}>
                          <Input
                            placeholder={intl.formatMessage(globalMessages.inputPlaceholder)}
                            disabled={!isModify(type)}
                            maxLength={tagNameMaxLen + 1}
                            onChange={(e: any) => changeTagName(e, index)}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'tag_category']}
                          fieldKey={[fieldKey, 'tag_category']}
                          label={intl.formatMessage(messages.tag_category)}
                          // initialValue={data.tag_category}
                          rules={[{ required: true, message: intl.formatMessage(globalMessages.required) }]}>
                          <Input
                            placeholder={intl.formatMessage(globalMessages.inputPlaceholder)}
                            disabled={!isModify(type)}
                          />
                        </Form.Item>
                      </>
                    )}
                  </>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Content>
    </Container>
  );
}

export default injectIntl(Step2);
```
