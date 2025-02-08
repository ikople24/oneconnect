import React, { useState } from "react";
import { Button } from "antd";
import ModalAddMarker from "@/components/modal/ModalAddMarker";

const Homepage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const data = {
    pintypes: [
      {
        id: 1,
        name: "OTOP",
      },
      {
        id: 2,
        name: "ผู้สูงอายุ",
      },
    ],
    fristName: "Jogn",
    lastName: "Doe",
  } 

  // form data คือ ค่าที่ได้จาก FORM ของ modal
  const handleOK = (formdata) => {
    console.log('formData', formdata);
    setOpen(false);
  }
  
  return (
    <div className="container mx-auto py-4">
      <Button onClick={() => setIsModalVisible(true)}>OPEN MODAL</Button>

      <ModalAddMarker
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        handleOK={handleOK}
        data={data}
      />
    </div>
  );
};

export default Homepage;
