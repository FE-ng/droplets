<!--
 * @Author: your name
 * @Date: 2021-07-02 17:50:44
 * @LastEditTime: 2021-07-12 19:38:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/work.md
-->

<img class="image800" src="https://cdn.jsdelivr.net/gh/FE-ng/picGo/blog/20210702175238.png"  alt="效果图" />

```typescript
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/*
 * @Author: your name
 * @Date: 2021-06-30 14:31:53
 * @LastEditTime: 2021-07-12 19:27:57
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
import { isView } from 'utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

import messages from '../messages';
import selectors from '../selectors';
import { formItemLayout, tagNameMaxLen } from '../constants';
import { Container, Category, CategoryTitle, CategoryItem, ITabs } from '../components/styled';
import { ISubTagList } from '../types';

const { useState, useEffect, useRef, useMemo } = React;
const { Content } = Layout;
const { TabPane } = Tabs;

interface IStep2 {
  intl: InjectedIntl;
  form: FormInstance;
}

function Step2(props: IStep2) {
  const { intl, form } = props;
  const mainModal = useSelector(selectors.mainModal);
  const [panelData, setPanelData] = useState<ISubTagList[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(-1);

  const addFunc = useRef(null);
  const { setFieldsValue, getFieldsValue, validateFields, resetFields } = form;
  const { type = 'edit', visible = false, data = {} } = mainModal;

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

  useEffect(() => {
    setPanelData(data.sub_tag_list || []);
  }, [JSON.stringify(data.sub_tag_list)]);

  const deleteCategory = async (index: number) => {
    const { sub_tag_list = [] } = getFieldsValue();
    const deleteInner = () => {
      if (sub_tag_list.length <= 0) return;
      const newStep1 = [...sub_tag_list];
      newStep1.splice(index, 1);
      panelData.splice(index, 1);
      setPanelData([...panelData]);
      setFieldsValue({ sub_tag_list: newStep1 });
      // 在下一个任务队列中更新idx 保证idx存在
      setTimeout(() => {
        const newIdx = index - 1 > 0 ? index - 1 : 0;
        setActiveCategory(panelData?.[newIdx]?.sub_tag_name || '');
        setActiveCategoryIdx(newIdx);
      }, 0);
    };
    try {
      if (index !== sub_tag_list.length - 1) {
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
    const idx = panelData.findIndex((item: ISubTagList) => item.sub_tag_name === activeKey);
    setActiveCategoryIdx(idx);
  };

  const addCategory = async () => {
    const values = await validateFields();
    if (!values) return;
    const defaultData = { sub_tag_name: intl.formatMessage(messages.tabPlaceholder) };
    const newPanelData = [...panelData, defaultData];
    setPanelData(newPanelData);
    addFunc.current();
    // 在下一个任务队列中更新idx 保证idx存在
    setTimeout(() => {
      setActiveCategory(intl.formatMessage(messages.tabPlaceholder));
      setActiveCategoryIdx(newPanelData.length - 1);
    }, 0);
  };

  const renderTabPane = useMemo(
    () =>
      panelData?.map?.((item: ISubTagList, index: number) => (
        <TabPane
          key={item.sub_tag_name}
          tab={
            <CategoryItem>
              <div>{item.sub_tag_name}</div>
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

  const changeTagName = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPanelData = cloneDeep(panelData);
    newPanelData[index].sub_tag_name = e.currentTarget.value;
    setPanelData(newPanelData);
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
          <Form.List name='sub_tag_list' initialValue={data.sub_tag_list}>
            {(fields, { add }) => (
              <>
                {/* 暴露add方法 */}
                {(addFunc.current = add)}
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <>
                    {/* 只显示当前的list */}
                    {activeCategoryIdx === index && (
                      <>
                        <Form.Item
                          {...restField}
                          name={[name, 'sub_tag_name']}
                          fieldKey={[fieldKey, 'sub_tag_name']}
                          label={intl.formatMessage(messages.sub_tag_name)}
                          rules={[
                            { required: true, message: intl.formatMessage(globalMessages.required) },
                            {
                              message: intl.formatMessage(globalMessages.maxCharacter, { max: tagNameMaxLen }),
                              max: tagNameMaxLen,
                            },
                            () => ({
                              validator(_: unknown, value: string) {
                                // 检测除自身外的key 有相同时校验失败
                                if (
                                  panelData.some(
                                    (item: ISubTagList, i: number) => i !== index && item.sub_tag_name === value,
                                  )
                                ) {
                                  return Promise.reject(intl.formatMessage(messages.sameKeyWarning));
                                }
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.resolve();
                              },
                            }),
                          ]}>
                          <Input
                            placeholder={intl.formatMessage(globalMessages.inputPlaceholder)}
                            disabled={isView(type)}
                            maxLength={tagNameMaxLen + 1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeTagName(e, index)}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'sub_tag_desc']}
                          fieldKey={[fieldKey, 'sub_tag_desc']}
                          label={intl.formatMessage(messages.sub_tag_desc)}
                          rules={[{ required: true, message: intl.formatMessage(globalMessages.required) }]}>
                          <Input
                            placeholder={intl.formatMessage(globalMessages.inputPlaceholder)}
                            disabled={isView(type)}
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
