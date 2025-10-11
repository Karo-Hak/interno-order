import React, { FC, useState } from 'react';
import './tagStretchOrder.css';
import AdditionalSection from './AdditionalSection';
import LightPlatformSection from './LightPlatformSection';
import LightRingSection from './LightRingSection';
import ProfilSection from './ProfilSection';
import StretchTexturesSection from './StretchTexturesSection';
import { v4 as uuidv4 } from 'uuid';
import BardutyunSection from './BardutyunSection';
import OtherSection from './OtherSection';
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';

interface RoomSectionProps {
  register: UseFormRegister<any>;
  reset: UseFormReset<any>;           // оставлен для совместимости
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  getValues: UseFormGetValues<any>;
  roomId: string;
  room: any;
  stretchTextureData: any;
  stretchAdditionalData: any;
  stretchProfilData: any;
  stretchLightPlatformData: any;
  stretchLightRingData: any;
  stretchBardutyunData: any;
}

// --- helpers
function addRow(setRowId: React.Dispatch<React.SetStateAction<string[]>>) {
  setRowId(prev => [...prev, uuidv4()]);
}

function removeRow(
  index: string,
  roomId: string,
  keyPrefix: string,
  setRowId: React.Dispatch<React.SetStateAction<string[]>>,
  setValue: UseFormSetValue<any>
) {
  const fieldKey = `${keyPrefix}_${index}/${roomId}`;
  setValue(fieldKey, undefined, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  setRowId(prev => prev.filter(id => id !== index));
}

const RoomSection: FC<RoomSectionProps> = ({
  register,
  reset,
  setValue,
  getValues,
  roomId,
  room,
  stretchTextureData,
  stretchAdditionalData,
  stretchProfilData,
  stretchLightPlatformData,
  stretchLightRingData,
  stretchBardutyunData
}: RoomSectionProps) => {

  const [stretchRowId, setStretchRowId] = useState<string[]>([]);
  const [additionalRowId, setAdditionalRowId] = useState<string[]>([]);
  const [profilRowId, setProfilRowId] = useState<string[]>([]);
  const [lightPlatformRowId, setLightPlatformRowId] = useState<string[]>([]);
  const [lightRingRowId, setLightRingRowId] = useState<string[]>([]);
  const [bardutyunRowId, setBardutyunRowId] = useState<string[]>([]);
  const [otherRowId, setOtherRowId] = useState<string[]>([]);

  const displayView = room.isChecked ? 'block' : 'none';

  return (
    <div style={{ display: displayView }}>
      <div key={roomId} style={{ margin: 'auto' }}>
        <div style={{ display: 'flex', margin: '5px' }}>
          <button type="button" onClick={() => addRow(setStretchRowId)}>Ձգվող Առաստաղ</button>
          <button type="button" onClick={() => addRow(setProfilRowId)}>Պրոֆիլ</button>
          <button type="button" onClick={() => addRow(setLightRingRowId)}>Լույսի Օղակ</button>
          <button type="button" onClick={() => addRow(setLightPlatformRowId)}>Լույսի Պլատֆորմ</button>
          <button type="button" onClick={() => addRow(setBardutyunRowId)}>Բարդություն</button>
          <button type="button" onClick={() => addRow(setAdditionalRowId)}>Այլ Ապրանք</button>
          <button type="button" onClick={() => addRow(setOtherRowId)}>Լրացուցիչ</button>
        </div>

        <StretchTexturesSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          stretchRowId={stretchRowId}
          removeStretchRow={(index, rid) => removeRow(index, rid, 'stretch', setStretchRowId, setValue)}
          roomId={roomId}
          stretchTexture={stretchTextureData}
        />

        <ProfilSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          profilRowId={profilRowId}
          removeProfilRow={(index, rid) => removeRow(index, rid, 'profil', setProfilRowId, setValue)}
          roomId={roomId}
          stretchProfil={stretchProfilData}
        />

        <LightRingSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          lightRingRowId={lightRingRowId}
          removeLightRingRowId={(index, rid) => removeRow(index, rid, 'lightRing', setLightRingRowId, setValue)}
          roomId={roomId}
          stretchLightRing={stretchLightRingData}
        />

        <LightPlatformSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          lightPlatformRowId={lightPlatformRowId}
          removeLightPlatformRowId={(index, rid) => removeRow(index, rid, 'lightPlatform', setLightPlatformRowId, setValue)}
          roomId={roomId}
          stretchLightPlatform={stretchLightPlatformData}
        />

        <BardutyunSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          bardutyunRowId={bardutyunRowId}
          removeBardutyunRow={(index, rid) => removeRow(index, rid, 'bardutyun', setBardutyunRowId, setValue)}
          roomId={roomId}
          stretchBardutyun={stretchBardutyunData}
        />

        <AdditionalSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          additionalRowId={additionalRowId}
          removeAdditionalRow={(index, rid) => removeRow(index, rid, 'additional', setAdditionalRowId, setValue)}
          roomId={roomId}
          stretchAdditional={stretchAdditionalData}
        />

        <OtherSection
          register={register}
          setValue={setValue}
          getValues={getValues}
          otherRowId={otherRowId}
          removeOtherRow={(index, rid) => removeRow(index, rid, 'other', setOtherRowId, setValue)}
          roomId={roomId}
        />
      </div>
    </div>
  );
};

export default RoomSection;
