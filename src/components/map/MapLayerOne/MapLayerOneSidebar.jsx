import { Row, Flex, Col, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { ENDPOINT } from "@/components/endpoint";
export default function MapLayerOneSidebar({
  changePage,
  selectedProvince,
  placeSelected,
  setFlyToLatLng,
  setPlaceSelected,
  setPlace,
  setSelectedProvince,
}) {
  const [regionList, setRegionList] = useState([]);
  const [regionSelected, setRegion] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([fetchProvince(), fetchPlaces(), fetchRegion()]);
    };

    fetchData();
  }, []);

  const fetchProvince = async (geographyId) => {
    try {
      const params = new URLSearchParams(
        geographyId && { geographyId: geographyId }
      );
      const province = await fetch(
        `${ENDPOINT.GET_ALL_PROVINCE}?${params.toString()}`
      );
      const response = await province.json();
      setProvinceList(response);
    } catch (error) {
      console.error("ERROR FETCH PROVINCE:", error);
    }
  };
  const fetchRegion = async (geographyId) => {
    try {
      const region = await fetch(`${ENDPOINT.GET_ALL_GEOGRAPHY}`);
      const response = await region.json();
      setRegionList(response);
    } catch (error) {
      console.error("ERROR FETCH REGION:", error);
    }
  };
  const fetchPlaces = async (provinceId, geographyId) => {
    try {
      console.log(provinceId, geographyId);
      const params = new URLSearchParams({
        provinceId: provinceId ?? "",
        geographyId: geographyId ?? "",
      });
      console.log(params);

      const places = await fetch(
        `${ENDPOINT.GET_ALL_PLACE}?${params.toString()}`
      );
      const response = await places.json();
      setPlaceList(response.data ?? []);
    } catch (error) {
      console.error("ERROR FETCH PLACES:", error);
    }
  };
  const onChangePlace = (value) => {
    console.log(value);
    setPlaceSelected({ ...value });
    setFlyToLatLng(value.location.coordinates);

    setPlace(value);
  };
  const onChangeProvince = async (value) => {
    console.log(value);
    setRegion(value?.geography_id);
    setSelectedProvince(value);
    setFlyToLatLng([value?.latitude, value?.longitude]);
    await fetchPlaces(value?._id);
  };
  const onChangeRegion = async (region) => {
    setSelectedProvince(null);
    setPlaceSelected(null);
    setRegion(region.id);
    await Promise.allSettled([
      fetchProvince(region.id),
      fetchPlaces(null, region.id),
    ]);
  };
  const handleConfirm = () => {
    if (placeSelected) {
      changePage();
    } else {
      alert("กรุณาเลือกพื้นที่ก่อนกดปุ่มยืนยัน");
    }
  };
  const onClearPlace = async () => {
    await fetchPlaces();
    setPlaceSelected(null);
    setRegion(null);
    setFlyToLatLng([13.885556744960699, 100.63529495228143]);
  };
  const onClearProvince = async () => {
    await Promise.allSettled([fetchProvince(), fetchPlaces()]);
    setSelectedProvince(null);
    setRegion(null);
    setFlyToLatLng([13.885556744960699, 100.63529495228143]);
  };
  return (
    <>
      <Row justify={"center"} wrap>
        <Col>
          <h1 className="text-2xl font-bold mb-4">
            เลือกพื้นที่ที่จะใช้บริการ
          </h1>
          <Flex gap="small" wrap className="mb-2">
            {regionList.map((region) => (
              <Button
                type={regionSelected === region.id ? "primary" : "default"}
                key={region.id}
                onClick={(e) => onChangeRegion(region)}
              >
                {region.name}
              </Button>
            ))}
          </Flex>
          <Flex gap={5}>
            <div>
              <Select
                notFoundContent="ไม่มีข้อมูลจังหวัด"
                showSearch
                placeholder="เลือกจังหวัดของคุณ"
                optionFilterProp="label"
                allowClear={true}
                onClear={onClearProvince}
                className="min-w-40"
                onChange={(value) => {
                  if (value) {
                    const provinceObj = provinceList.find(
                      (province) => province._id === value
                    );
                    onChangeProvince(provinceObj);
                  }
                }}
                value={selectedProvince?._id ?? null}
                options={provinceList.map((province) => {
                  return {
                    label: province.name_th,
                    value: province._id,
                  };
                })}
              />
            </div>
            <div>
              <Select
                showSearch
                notFoundContent="ไม่มีข้อมูลเมือง"
                placeholder="เลือกเมืองของคุณ"
                optionFilterProp="label"
                allowClear={true}
                onClear={onClearPlace}
                className="min-w-40"
                onChange={(value) => {
                  if (value) {
                    const placeObj = placeList.find(
                      (place) => place._id === value
                    );
                    onChangePlace(placeObj);
                  }
                }}
                value={placeSelected?._id ?? null}
                options={placeList.map((place) => {
                  return {
                    label: place.municipalityName,
                    value: place._id,
                  };
                })}
              />
            </div>
          </Flex>
          <div className={`text-center my-4`}>
            <Button
              onClick={handleConfirm}
              disabled={!placeSelected}
              type="primary"
            >
              ยืนยัน
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
