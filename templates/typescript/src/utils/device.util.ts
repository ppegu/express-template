export function getDeviceinfo(body: any) {
  return {
    name: body?.deviceName,
    uuid: body?.deviceUuid,
    version: body?.deviceVersion,
    manufacturer: body?.deviceManufacturer,
    os: body?.deviceOs,
  };
}
