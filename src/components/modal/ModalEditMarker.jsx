import React, { useEffect, useMemo } from "react";
import { Form, TimePicker, Input, Row, Col, Modal, Button, Select } from "antd";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import { useMarkerUpdate } from "@/hooks/user-markers";
import { ModalEditPlaceDetail } from "./ModalEditDetail/ModalEditPlaceDetail";
import { ModalEditPersonDetail } from "./ModalEditDetail/ModalEditPersonDetail";

const ModalEditMarkerDetail = ({
  setModalEditMarkerIsVisible,
  visible,
  onCancel,
  data,
}) => {
  const { mutate: updateMarker } = useMarkerUpdate();
  const [form] = Form.useForm();

  if (!data) return null;

  const isPlace =
    data.properties.markerType.type.name === MainMarkerTypeEnum.PLACES;
  const isPerson =
    data.properties.markerType.type.name === MainMarkerTypeEnum.PERSON;

  const onSubmit = async () => {
    try {
      await form.validateFields();
      const value = await form.getFieldsValue();
      console.log("value on submit", value);

      updateMarker({ id: data._id, body: value });
      setModalEditMarkerIsVisible(false);
    } catch (error) {
      console.log("error :", error);
    }
  };
  return (
    <>
      <Modal
        open={visible || false}
        onCancel={onCancel}
        key={data._id}
        footer={() => {
          return (
            <>
              <Button type="primary" onClick={onSubmit}>
                บันทึก
              </Button>
              <Button onClick={onCancel}>ปิด</Button>
            </>
          );
        }}
      >
        <div>
          <p className="text-xl">แก้ไขข้อมูลหมุด</p>
        </div>
        <div className="my-5">
          {/* Render both, control visibility with prop */}
          <ModalEditPlaceDetail form={form} marker={data} visible={isPlace} />
          <ModalEditPersonDetail form={form} marker={data} visible={isPerson} />
        </div>
      </Modal>
    </>
  );
};

export default ModalEditMarkerDetail;
