import { Row, Flex, Col, Select, Button } from "antd";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ENDPOINT } from "@/components/endpoint";
import ApiClient from "@/utils/apiClient";
const DEFAULT_CENTER = [13.885556744960699, 100.63529495228143];

const useFetchData = (apiClient) => {
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [placeList, setPlaceList] = useState([]);

  const fetchRegion = useCallback(async () => {
    try {
      const response = await apiClient.get(ENDPOINT.GET_ALL_GEOGRAPHY);
      setRegionList(response);
    } catch (error) {
      console.error("ERROR FETCH REGION:", error);
    }
  }, [apiClient]);

  const fetchProvince = useCallback(
    async (geographyId) => {
      try {
        const params = geographyId ? new URLSearchParams({ geographyId }) : "";
        const url = `${ENDPOINT.GET_ALL_PROVINCE}?${params}`;
        const response = await apiClient.get(url);
        setProvinceList(response);
      } catch (error) {
        console.error("ERROR FETCH PROVINCE:", error);
      }
    },
    [apiClient]
  );

  const fetchPlaces = useCallback(
    async (provinceId, geographyId) => {
      try {
        const params = new URLSearchParams({
          provinceId: provinceId ?? "",
          geographyId: geographyId ?? "",
        });
        const url = `${ENDPOINT.GET_ALL_PLACE}?${params}`;
        const response = await apiClient.get(url);
        setPlaceList(response.data ?? []);
      } catch (error) {
        console.error("ERROR FETCH PLACES:", error);
      }
    },
    [apiClient]
  );

  return {
    regionList,
    provinceList,
    placeList,
    fetchRegion,
    fetchProvince,
    fetchPlaces,
  };
};

export default function MapLayerOneSidebar({
  changePage,
  selectedProvince,
  placeSelected,
  setFlyToLatLng,
  setPlaceSelected,
  setPlace,
  setSelectedProvince,
}) {
  const apiClient = useMemo(() => new ApiClient(), []);
  const {
    regionList,
    provinceList,
    placeList,
    fetchRegion,
    fetchProvince,
    fetchPlaces,
  } = useFetchData(apiClient);

  const [regionSelected, setRegion] = useState(null);

  useEffect(() => {
    fetchProvince();
    fetchPlaces();
    fetchRegion();
  }, [fetchRegion]);

  const onChangePlace = (value) => {
    setPlaceSelected(value);
    setFlyToLatLng(value?.location?.coordinates);
    setPlace(value);
  };
  const onChangeProvince = async (province) => {
    setRegion(province?.geography_id);
    setSelectedProvince(province);
    setFlyToLatLng([province?.latitude, province?.longitude]);
    await fetchPlaces(province?._id);
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
    setPlaceSelected(null);
    setFlyToLatLng(DEFAULT_CENTER);
  };

  return (
    <>
      <Row justify={"center"} wrap>
        <Col>
          <h1 className="text-2xl font-bold mb-4">
            เลือกพื้นที่ที่จะใช้บริการ
          </h1>
          <div className="mb-2">
            {regionList.map((region) => (
              <Button
                key={region.id}
                type={regionSelected === region.id ? "primary" : "default"}
                onClick={() => onChangeRegion(region)}
              >
                {region.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-5">
            <Select
              notFoundContent="ไม่มีข้อมูลจังหวัด"
              showSearch
              placeholder="เลือกจังหวัดของคุณ"
              optionFilterProp="label"
              allowClear
              onClear={onClearProvince}
              className="min-w-40"
              onChange={(value) => {
                const province = provinceList.find((p) => p._id === value);
                onChangeProvince(province);
              }}
              value={selectedProvince?._id ?? null}
              options={provinceList.map((province) => ({
                label: province.name_th,
                value: province._id,
              }))}
            />
            <Select
              notFoundContent="ไม่มีข้อมูลเมือง"
              showSearch
              placeholder="เลือกเมืองของคุณ"
              optionFilterProp="label"
              allowClear
              onClear={onClearPlace}
              className="min-w-40"
              onChange={(value) => {
                const place = placeList.find((p) => p._id === value);
                onChangePlace(place);
              }}
              value={placeSelected?._id ?? null}
              options={placeList.map((place) => ({
                label: place.municipalityName,
                value: place._id,
              }))}
            />
          </div>
          <div className="text-center my-4">
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
