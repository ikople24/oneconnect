import React, { useMemo } from "react";
import { Modal, Button } from "antd";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import { ModalPlaceDetail } from "@/components/modal/ModalDetail/ModalPlaceDetail";
import { ModalPersonDetail } from "@/components/modal/ModalDetail/ModalPersonDetail";
const ModalMarkerDetail = ({ visible, onCancel, data }) => {
  if (!data) return null;

  const markerType = useMemo(() => {
    switch (data.properties.markerType.type.name) {
      case MainMarkerTypeEnum.PLACES:
        return <ModalPlaceDetail marker={data} />;
      case MainMarkerTypeEnum.PERSON:
        return <ModalPersonDetail marker={data} />;
      default:
        return null;
    }
  }, [data]);

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        key={data._id}
        footer={() => {
          return <Button onClick={onCancel}>ปิด</Button>;
        }}
      >
        {markerType}
      </Modal>
    </>
  );
};

export default ModalMarkerDetail;
