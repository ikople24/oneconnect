import { useEffect, useMemo } from "react";
import { Form, Input, Row, Col, Select, DatePicker, Button } from "antd";
import moment from "moment";
import th from "antd/es/date-picker/locale/th_TH";
import dayTh from "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import dayjs from "dayjs";
import { useState } from "react";
export const ModalEditPersonDetail = ({ form, marker, visible }) => {
  if (!visible) return null;
  const [genderSelected, setGenderSelected] = useState(
    marker?.properties?.markerInfo?.data?.gender
  );
  const [genderChoice] = useState([
    { label: "ชาย", value: "Male" },
    { label: "หญิง", value: "Female" },
  ]);
  console.log(genderSelected);
  dayjs.extend(buddhistEra);
  dayjs.locale(dayTh);
  const buddhistLocale = {
    ...th,
    lang: {
      ...th.lang,
      fieldDateFormat: "BBBB-MM-DD",
      fieldDateTimeFormat: "BBBB-MM-DD HH:mm:ss",
      yearFormat: "BBBB",
      cellYearFormat: "BBBB",
    },
  };
  const markerDetail = useMemo(() => {
    if (!marker) return {};
    return {
      name: marker.properties.markerInfo.name,
      description: marker.properties.markerInfo.description,
      firstName: marker.properties.markerInfo.data.firstName,
      lastName: marker.properties.markerInfo.data.lastName,
      gender: marker.properties.markerInfo.data.gender,
      idCard: marker.properties.markerInfo.data.idCard,
      telNumber: marker.properties.markerInfo.data.telNumber,
      birthdate: marker.properties.markerInfo.data.birthdate
        ? dayjs(marker.properties.markerInfo.data.birthdate)
        : null,
      age: marker.properties.markerInfo.data.age,
    };
  }, [form, marker]);

  useEffect(() => {
    if (markerDetail) {
      form.setFieldsValue(markerDetail);
    }
  }, [markerDetail, form]);
  const handleBirthdateChange = (date) => {
    if (!date) {
      form.setFieldsValue({ age: null });
      return;
    }
    const age = calculateAge(date);
    form.setFieldsValue({ age });
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };
  // Function to calculate age
  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const birthMoment = dayjs(birthdate);
    const age = dayjs().diff(birthMoment, "year");
    return age;
  };

  const handleGenderChange = (value) => {
    form.setFieldsValue({ gender: value });
    setGenderSelected(value);
  };
  return (
    <Form
      form={form}
      name="edit-place-detail"
      initialValues={markerDetail}
      layout="vertical"
    >
      <Row gutter={8}>
        <Col span={24} sm={12}>
          <Form.Item
            name="name"
            label="ชื่อหมุด"
            rules={[{ required: true, message: "กรุณากรอกชื่อหมุด" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24} sm={12}>
          <Form.Item name="description" label="รายละเอียดหมุด">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={24} sm={12}>
          <Form.Item name="firstName" label="ชื่อจริง">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item name="lastName" label="นามสกุล">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="gender"
            label="เพศ"
            rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
          >
            <div className="flex flex-wrap gap-2">
              {genderChoice.map((gender) => (
                <Button
                  key={gender.value}
                  className={
                    genderSelected === gender.value
                      ? "border border-green-800 rounded-sm"
                      : "rounded-sm"
                  }
                  onClick={() => handleGenderChange(gender.value)}
                >
                  {gender.label}
                </Button>
              ))}
            </div>

            {/* <Select placeholder="e.g., ชาย / หญิง / อื่น ๆ">
              <Option value="Male">ชาย</Option>
              <Option value="Female">หญิง</Option>
            </Select> */}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item name="idCard" label="เลขบัตรประชาชน">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item name="telNumber" label="เบอร์โทรศัพท์">
            <Input />
          </Form.Item>
        </Col>

      </Row>

      {/* <Row gutter={8}>
        <Col span={24} sm={12}>
          <Form.Item name="telNumber" label="เบอร์โทรศัพท์">
            <Input />
          </Form.Item>
        </Col>
      </Row> */}

      <Row gutter={8}>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="birthdate"
            label="วันเกิด"
            rules={[{ required: true, message: "กรุณากรอกวันเกิด" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="e.g., 2025-01-12"
              onChange={(e) => handleBirthdateChange(e)}
              format="DD/MM/BBBB"
              locale={buddhistLocale}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="age"
            label="อายุ"
            rules={[{ required: true, message: "กรุณากรอกอายุ" }]}
          >
            <Input placeholder="e.g., 30" disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
