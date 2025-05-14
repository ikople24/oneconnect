import TitlePage from "@/components/ui/Admin/TitlePage";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Select, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ENDPOINT } from "@/components/endpoint";
import ApiClient from "@/utils/apiClient";
import { convertKMZFileToObject } from "@/utils/utils";
import { ZoneColorSelected } from "@/components/admin/places/subcomponents/ZoneColorSelected";

const { Option } = Select;

const CreatePlaceForm = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();
  const [cityFile, setCityFile] = useState(null);
  const [zoneFile, setZoneFile] = useState(null);
  const [province, setProvince] = useState([]);
  const [zoneData, setZoneData] = useState(null);
  const [coloredZoneData, setColoredZoneData] = useState(null);
  const apiClient = new ApiClient();

  const handleFileChange = async (info, type) => {
    const file = info.file;
    if (type === "city") {
      setCityFile(file);
    } else {
      const zoneGeoJSON = await convertKMZFileToObject(file);
      console.log("zoneGeoJSON", zoneGeoJSON);
      setZoneData(zoneGeoJSON);
      setZoneFile(file);
    }
  };

  const handleSubmit = async (values) => {
    if (!cityFile || !zoneFile) {
      message.error("กรุณาอัปโหลดไฟล์ City และ Zone");
      return;
    }

    const formData = new FormData();
    formData.append("municipalityName", values.municipalityName);
    formData.append("province", values.province);
    formData.append("amphurName", values.amphurName);
    formData.append("tambolName", values.tambolName);
    formData.append("postCode", values.postCode);
    formData.append("population", values.population);
    formData.append("household", values.household);
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", values.latitude);
    formData.append("location[coordinates][1]", values.longitude);
    formData.append("city", cityFile);
    // formData.append("zone", zoneFile);
    console.log("before upload", coloredZoneData);
    formData.append(
      "zone",
      JSON.stringify(coloredZoneData)
    );

    try {
      const url = ENDPOINT.CREATE_PLACE_DASHBOARD;
      const body = formData;
      console.log("body", Object.fromEntries(formData.entries()));
      const response = await apiClient.postBuffer(url, body);
      message.success("สร้างเมืองสำเร็จ!");
      form.resetFields();
      setCityFile(null);
      setZoneFile(null);
    } catch (error) {
      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const beforeUpload = (file) => {
    const isKMZ = file.name.split(".").pop().toLowerCase() === "kmz";
    if (!isKMZ) {
      message.error("กรุณาอัปโหลดไฟล์ .kmz เท่านั้น");
    }
    return !isKMZ;
  };

  // FOR LIFE CYCLE
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const url = ENDPOINT.GET_ALL_PROVINCE_NAME;
        const response = await apiClient.get(url);
        setProvince(response);
      } catch (error) {
        console.log("Error fetching provinces:::");
      }
    };

    fetchProvinces();
  }, []);

  return (
    <Modal
      title="เพิ่มเมือง"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={"50vw"}
    >
      <div className="py-6 max-h-[70vh] overflow-y-auto">
        <div className="bg-white shadow-sm p-6">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="municipalityName"
              label="หน่วยงาน"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="province"
              label="จังหวัด"
              rules={[{ required: true, message: "กรุณาเลือกจังหวัด" }]}
            >
              <Select placeholder="เลือกจังหวัด">
                {province.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name_th}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="amphurName"
              label="อำเภอ"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="tambolName"
              label="ตำบล"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="postCode"
              label="รหัสไปรษณีย์"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="population"
              label="จำนวนประชากร"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="household"
              label="จำนวนครัวเรือน"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="longitude"
              label="ลองจิจูด"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="latitude"
              label="ละติจูด"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item label="เมือง">
              <Upload
                beforeUpload={beforeUpload}
                onChange={(info) => handleFileChange(info, "city")}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>อัพโหลดไฟล์เมือง</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="ชุมชน">
              <Upload
                beforeUpload={beforeUpload}
                onChange={(info) => handleFileChange(info, "zone")}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>อัพโหลดไฟล์ชุมชน</Button>
              </Upload>

              <ZoneColorSelected
                zone={zoneData}
                onZoneChange={setColoredZoneData}
                isEdit={false}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePlaceForm;
