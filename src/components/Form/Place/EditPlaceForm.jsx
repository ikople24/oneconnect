import { Form, Input, Button, message, Select, Modal, Spin } from "antd";
import { ENDPOINT } from "@/components/endpoint";
import { ZoneColorSelected } from "@/components/admin/places/subcomponents/ZoneColorSelected";
import { useEffect, useState } from "react";
import { useProvince } from "@/hooks/use-province";
import ApiClient from "@/utils/apiClient";

const EditPlaceForm = ({
  isModalOpen,
  setIsModalOpen,
  initialValues,
  zoneDataFromServer,
}) => {
  const { data: provinceData, isLoading: provinceLoading } = useProvince();

  const [form] = Form.useForm();
  const [coloredZoneData, setColoredZoneData] = useState(null);

  const apiClient = new ApiClient();

  useEffect(() => {
    if (initialValues) {
      console.log("initialValues", initialValues);
      const valueTmp = { ...initialValues };
      valueTmp.latitude = initialValues.location.coordinates[0];
      valueTmp.longitude = initialValues.location.coordinates[1];
      valueTmp.province = initialValues?.province?._id;
      form.setFieldsValue(valueTmp);
    }
  }, [initialValues]);
  if (provinceLoading) {
    return <Spin />;
  }
  const handleSubmit = async (values) => {
    const payload = {
      municipalityName: values.municipalityName,
      province: values.province,
      amphurName: values.amphurName,
      tambolName: values.tambolName,
      postCode: values.postCode,
      population: values.population,
      household: values.household,
      location: {
        type: "Point",
        coordinates: [values.latitude, values.longitude],
      },
      zones: coloredZoneData, // no need to stringify
    };

    try {
      const url = `${ENDPOINT.UPDATE_PLACE}/${initialValues._id}`;
      console.log("payload before update", payload);
      const response = await apiClient.patch(url, payload); // send as JSON
      message.success("อัปเดตเมืองสำเร็จ!");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <Modal
      title="แก้ไขเมือง"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={"50vw"}
    >
      <div className="py-6 max-h-[70vh] overflow-y-auto">
        <div className="bg-white shadow-sm p-6">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            {/* Same input fields as create form */}
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
              rules={[{ required: true }]}
            >
              <Select
                placeholder="เลือกจังหวัด"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {provinceData?.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name_th}
                  </Select.Option>
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

            <Form.Item label="แก้ไขสีชุมชน">
              <ZoneColorSelected
                zone={initialValues?.zones}
                onZoneChange={setColoredZoneData}
                isEdit={true}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                บันทึกการแก้ไข
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default EditPlaceForm;
