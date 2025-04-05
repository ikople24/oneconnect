import {
  Row,
  Form,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  TimePicker,
} from "antd";
import th from "antd/es/date-picker/locale/th_TH";
import dayTh from "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import dayjs from "dayjs";
import moment from "moment";

const ModalAddPlace = ({
  form,
  zoneSelected,
  place,
  isAdmin,
  isLatLngError,
  isTriggerReq,
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
        <Col span={24} sm={24} md={12} xl={12} xxl={12}>
          <Form.Item
            name="openingDate"
            label="วันทำการ"
            rules={[{ required: true, message: "กรุณาเลือกวันทำการ" }]}
          >
            <Select placeholder="e.g., ทุกวัน">
              <Option key={"ทุกวัน"} value={"ทุกวัน"}>
                ทุกวัน
              </Option>
              <Option key={"จันทร์ - ศุกร์"} value={"จันทร์ - ศุกร์"}>
                จันทร์ - ศุกร์
              </Option>
              <Option key={"เสาร์ - อาทิตย์"} value={"เสาร์ - อาทิตย์"}>
                เสาร์ - อาทิตย์
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="openingTime"
              label="เวลาทำการ"
              rules={[{ required: true, message: "กรุณาเลือกเวลาเปิดปิด" }]}
            >
              <TimePicker.RangePicker />
            </Form.Item>
          </Col>
        </Row>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="description"
            label="รายละเอียด"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
          >
            <Input.TextArea
              rows={4}
              type=""
              placeholder="e.g., กรอกรายละเอียดพื้นที่"
              maxLength={200}
            />
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

export default ModalAddPlace;
