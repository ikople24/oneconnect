import { Row, Col, Select, Button } from "antd";
import { useRegions } from "@/hooks/use-regions";
import { useProvince } from "@/hooks/use-province";
import { usePlace } from "@/hooks/user-places";
import { useGlobalMapContext } from "@/context/MapContext";
const DEFAULT_CENTER = [13.885556744960699, 100.63529495228143];

export default function MapLayerOneSidebar({  }) {
   const {
     placeSelected,
     setPlaceSelected,
     provinceSelected,
     setProvinceSelected,
     regionSelected,
     setRegionSelected,
     layer,
     changeLayer,
     coordinateSelected,
     setCoordinateSelected, 
   } = useGlobalMapContext();
  const { data: regionList, isLoading: regionListLoading } = useRegions();
  const { data: provinceList, isLoading: provinceListLoading } = useProvince(regionSelected);
  const { data: placeList, isLoading: placeListLoading } = usePlace({
    placeId: placeSelected?._id ? placeSelected?._id : "",
    geographyId: regionSelected ? regionSelected : ""
  });


  if (placeListLoading) return <div>Loading...</div>;
  if (regionListLoading) return <div>Loading...</div>;
  if (provinceListLoading) return <div>Loading...</div>;
  console.log('place list',placeList)

  const onChangePlace = (value) => {
    setPlaceSelected(value);
    setCoordinateSelected(value?.location?.coordinates);
  };
  const onChangeProvince = async (province) => {
    setRegionSelected(province?.geography_id);
    setProvinceSelected(province);
    setCoordinateSelected([province?.latitude, province?.longitude]);
  };
  const onChangeRegion = async (region) => {
    console.log(region);
    setRegionSelected(region.id);
    setProvinceSelected(null);
    setPlaceSelected(null);
  };

  const handleConfirm = () => {
    if (placeSelected) {
      changeLayer(!layer);
    } else {
      alert("กรุณาเลือกพื้นที่ก่อนกดปุ่มยืนยัน");
    }
  };
  const onClearPlace = async () => {
    setPlaceSelected(null);
    setRegionSelected(null);
    setCoordinateSelected(DEFAULT_CENTER);
  };

  const onClearProvince = async () => {
    setProvinceSelected(null);
    setPlaceSelected(null);
    setRegionSelected(null);
    setCoordinateSelected(DEFAULT_CENTER);
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
              value={provinceSelected?._id ?? null}
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
