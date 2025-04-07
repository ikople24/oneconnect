import { Row, Form, Col, Input, Select, DatePicker, Button } from "antd";
import th from "antd/es/date-picker/locale/th_TH";
import dayTh from "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import dayjs from "dayjs";
import moment from "moment";

const ModalAddMaker = ({
  form,
  zoneSelected,
  place,
  isAdmin,
  isTriggerReq,
  isLatLngError,
  isLoadingLatLng,
  getLocation,
}) => {
  console.log(zoneSelected);
  dayjs.extend(buddhistEra);
  dayjs.locale(dayTh);
  const { Option } = Select;
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
  const handleBirthdateChange = (date) => {
    const age = calculateAge(date.toString());
    console.log(age);
    form.setFieldsValue({ age });
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };
  // Function to calculate age
  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const birthMoment = moment(birthdate);
    const age = moment().diff(birthMoment, "years");
    return age;
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="idCard"
            label="เลขบัตรประชาชน (13 หลัก)"
            rules={[
              { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
              {
                pattern: /^[0-9]{13}$/,
                message: "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง(13 หลัก)",
              },
            ]}
          >
            <Input placeholder="e.g., 1234567890123" maxLength={13} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="firstName"
            label="ชื่อจริง"
            rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
          >
            <Input placeholder="e.g., สมชาย" maxLength={20} />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="lastName"
            label="นามสกุล"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
          >
            <Input placeholder="e.g., ใจดี" maxLength={20} />
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
            <Select placeholder="e.g., ชาย / หญิง / อื่น ๆ">
              <Option value="Male">ชาย</Option>
              <Option value="Female">หญิง</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
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
      <Row gutter={8}>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="telNumber"
            label="เบอร์โทรศัพท์"
            rules={[
              { required: true, message: "กรุณากรอกเบอร์โทรศัพท์" },
              { max: 10, message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง" },
              {
                pattern: /^[0-9]{10}$/,
                message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)",
              },
            ]}
          >
            <Input placeholder="e.g., 0812345678" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="zone"
            label="ชุมชน"
            rules={[{ required: true, message: "กรุณาขอข้อมูลตำแหน่ง" }]}
          >
            <Select
              placeholder="กรุณาขอข้อมูลตำแหน่ง"
              disabled
              value={zoneSelected?.zoneId}
            >
              <Option key={zoneSelected?.zoneId} value={zoneSelected?.zoneId}>
                {zoneSelected?.zoneName}
              </Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="placeId"
            label="เมือง"
            rules={[{ required: true, message: "กรุณากรอกรหัสเมือง" }]}
          >
            <Select
              placeholder="กรุณาขอข้อมูลตำแหน่ง"
              disabled
              value={place?._id}
            >
              <Option key={place._id} value={place._id}>
                {place.amphurName}
              </Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="latitude"
            label="ละติจูด"
            rules={[{ required: true, message: "ละติจูด" }]}
          >
            <Input placeholder="กรุณาขอข้อมูลตำแหน่ง" disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="longitude"
            label="ลองจิจูด"
            rules={[{ required: true, message: "ลองจิจูด" }]}
          >
            <Input placeholder="กรุณาขอข้อมูลตำแหน่ง" disabled />
          </Form.Item>
        </Col>
      </Row>
      {!isAdmin && (
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            {isTriggerReq === false && isAdmin !== true && (
              <span className="text-red-500 text-sm">
                * กรุณาขอข้อมูลตำแหน่ง
              </span>
            )}
            {isLatLngError && (
              <span className="text-red-500 text-sm">
                * คุณไม่ได้อยู่ในพื้นที่
              </span>
            )}
            <Button
              className="w-full"
              type="primary"
              onClick={() => getLocation()}
              loading={isLoadingLatLng ? isLoadingLatLng : false}
            >
              ขอข้อมูลตำแหน่ง
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ModalAddMaker;
