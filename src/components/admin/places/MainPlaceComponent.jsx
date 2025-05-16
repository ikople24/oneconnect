import CreatePlaceForm from "@/components/Form/Place/CreatePlaceForm";
import { TablePlaceList } from "./subcomponents/TablePlaceList";
import TitlePage from "@/components/ui/Admin/TitlePage";
import { useState } from "react";
import { Button,App } from "antd";
import EditPlaceForm from "@/components/Form/Place/EditPlaceForm";
import { useDeletePlace } from "@/hooks/user-places";

export const MainPlaceComponent= () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [zoneDataFromServer, setZoneDataFromServer] = useState(null);

  const {mutateAsync: deletePlace} = useDeletePlace()
   const { message, modal } = App.useApp();

  const handleEditSelected = async (record) => {
    setInitialValues(record);
    setZoneDataFromServer(record?.zones);
    setIsModalEditOpen(true);
  };
  const handleDeleteSelected = async (placeId) => {
    modal.confirm({
      title: "ยืนยันการลบเมือง",
      content: "คุณแน่ใจหรือว่าต้องการลบเมืองนี้?",
      okText: "ใช่, ลบเลย",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await deletePlace({ placeId: placeId });
          message.success("ลบเมืองสำเร็จ!");
        } catch (error) {
          console.error(error);
          message.error("เกิดข้อผิดพลาดในการลบเมือง");
        }
      },
    });
    
  }
  return (
    <>
      <TitlePage title={"จัดการเมือง"} />

      <div className="flex justify-end my-2">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
         เพิ่มเมือง 
        </Button>
      </div>
      <TablePlaceList handleEditSelected={handleEditSelected} handleDelete={handleDeleteSelected} />
      <CreatePlaceForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
        <EditPlaceForm
        isModalOpen={isModalEditOpen}
        setIsModalOpen={setIsModalEditOpen}
        initialValues={initialValues}
        zoneDataFromServer={zoneDataFromServer}
      />
    </>
  );
};
