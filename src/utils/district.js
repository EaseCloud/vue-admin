import areaData from 'china-area-data'

export default {
  areaPrefix (district, length = 6) {
    return Number((`${district.toString().substr(0, length)}000000`).substr(0, 6));
  },
  getDistrict (adcode = 86) {
    return areaData[adcode] || [];
  },
  getDistrictFullNameByCode (adcode) {
    return adcode ?
      `${this.getDistrictNameByCode(this.areaPrefix(adcode, 2))} ` +
      `${this.getDistrictNameByCode(this.areaPrefix(adcode, 4))} ` +
      `${this.getDistrictNameByCode(adcode)}` : '';
  },
  getDistrictNameByCode (adcode) {
    const parentCode = this.getDistrictParentCode(adcode);
    return parentCode && areaData[parentCode][adcode];
  },
  getDistrictParentCode (adcode) {
    if (adcode % 10000 === 0) return 86;
    if (adcode % 100 === 0) return adcode - adcode % 10000;
    return adcode - adcode % 100;
  },
  getProvinceNameByCode (adcode) {
    return this.getDistrictNameByCode(adcode - adcode % 10000);
  },
  getCityNameByCode (adcode) {
    return this.getDistrictNameByCode(adcode - adcode % 100);
  }
}
