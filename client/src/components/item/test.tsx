import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import { List, Typography } from "antd";
import { DragOutlined } from "@ant-design/icons";
// import "antd/dist/antd.css";

/*
  This example uses react-drag-listview, and AntDesign which can be found
  at their respective links below:
  https://github.com/raisezhang/react-drag-listview#readme
  https://ant.design/docs/react/introduce
*/

/* MOCK DATA: parent list as Value, subList as subList */
const mockData = [
  {
    id: "category-one",
    value: "Category One",
    subList: [
      "Eget odio bibendum commodo malesuada Mattis montes.",
      "Nullam at rhoncus. Erat pretium pharetra auctor.",
      "Justo sed interdum sociosqu a molestie nascetur nostra metus.",
    ],
  },
  {
    id: "category-two",
    value: "Category Two",
    subList: [
      "Senectus libero blandit consectetuer penatibus gravida quisque lacinia id nunc.",
      "Elit. Ac. Nulla justo nibh. Fringilla, class Tempor consequat proin.",
    ],
  },
];

export const NestedDraggableList = () => {
  const [data, setData] = useState(mockData);

  /*
    REORDER ACCEPTS:
      list: arr, accepts array of data to be reordered,
      fromIndex: int, onDragStart index,
      toIndex: int, onDragEnd index,
  */

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  /*
    ON DRAG END EVENT HANDLER ACCEPTS:
      fromIndex: int, onDragStart index,
      toIndex: int, onDragEnd index,
      type: str, ReactDragListView Identifier,
      index: MUST be parent list index,
  */

  const onDragEnd = (fromIndex, toIndex, type, index) => {
    /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
    if (toIndex < 0) return;

    /* REORDER PARENT OR SUBLIST, ELSE THROW ERROR */
    if (type === "LIST-ITEM") {
      const categories = reorder(data, fromIndex, toIndex);
      return setData(categories);
    } else if (type === "SUBLIST-ITEM") {
      const subList = reorder(data[index].subList, fromIndex, toIndex);
      const categories = JSON.parse(JSON.stringify(data));
      categories[index].subList = subList;
      return setData(categories);
    } else return new Error("NOT A VALID LIST");
  };
  /*\
    nodeSelector={}, DRAGGABLE ELEMENT IDENTIFIER, i.e 'li', ant-list.draggable>
    ALL STYLES APPLIED TO lineClassName MUST BE OVERRIDDEN WITH !important
  */
  return (
    <ReactDragListView
      nodeSelector=".ant-list.draggable"
      lineClassName="dragLine"
      onDragEnd={(fromIndex, toIndex) =>
        onDragEnd(fromIndex, toIndex, "LIST-ITEM")
      }
    >
      {data.map(({ value, subList }, index) => (
        <List
          header={
            <Typography.Text strong className="grabbable">
              <DragOutlined className="icon" />
              {value}
            </Typography.Text>
          }
          key={index}
          className="draggable"
        >
          <ReactDragListView
            nodeSelector=".ant-list-item.draggable-item"
            lineClassName="dragLine"
            onDragEnd={(fromIndex, toIndex) =>
              onDragEnd(fromIndex, toIndex, "SUBLIST-ITEM", index)
            }
          >
            {subList.map((item, index) => (
              <List.Item key={index} className="draggable-item">
                <DragOutlined className="icon" />
                <List.Item.Meta title={item} className="grabbable" />
              </List.Item>
            ))}
          </ReactDragListView>
        </List>
      ))}
    </ReactDragListView>
  );
};
