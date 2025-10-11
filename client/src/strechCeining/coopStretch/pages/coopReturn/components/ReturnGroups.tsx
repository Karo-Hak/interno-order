import React from 'react';
import {
  Control,
  UseFormSetValue,
  UseFormGetValues,
  FieldValues, // 👈
  Path,        // 👈 удобно типизировать имена полей формы
} from 'react-hook-form';
import TextureGroup from '../../addCoopCeilingOrder/components/TextureGroup';
import SimpleGroup from '../../addCoopCeilingOrder/components/SimpleGroup';

type CatalogItem = { _id: string; name: string; price: number };

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  getValues: UseFormGetValues<TFormValues>;

  textures: CatalogItem[];
  profils: CatalogItem[];
  platforms: CatalogItem[];
  rings: CatalogItem[];

  fieldNames: {
    texture: Path<TFormValues>;
    profil: Path<TFormValues>;
    platform: Path<TFormValues>;
    ring: Path<TFormValues>;
  };

  forceQtyVisible?: boolean;
};

function ReturnGroups<TFormValues extends FieldValues>(props: Props<TFormValues>) {
  const {
    control, setValue, getValues,
    textures, profils, platforms, rings,
    fieldNames, forceQtyVisible,
  } = props;

  return (
    <div className="groups two-col">
      <div className="card dense">
        <TextureGroup
          title="Stretch Texture (Վերադարձ)"
          control={control as any}
          name={fieldNames.texture as any}
          catalog={textures}
          setValue={setValue as any}
          getValues={getValues as any}
          forceQtyVisible={forceQtyVisible}
        />
      </div>

      <div className="card dense">
        <SimpleGroup
          title="Profil (Վերադարձ)"
          control={control as any}
          name={fieldNames.profil as any}
          catalog={profils}
          setValue={setValue as any}
          getValues={getValues as any}
        />
      </div>

      <div className="card dense">
        <SimpleGroup
          title="Light Platform (Վերադարձ)"
          control={control as any}
          name={fieldNames.platform as any}
          catalog={platforms}
          setValue={setValue as any}
          getValues={getValues as any}
        />
      </div>

      <div className="card dense">
        <SimpleGroup
          title="Light Ring (Վերադարձ)"
          control={control as any}
          name={fieldNames.ring as any}
          catalog={rings}
          setValue={setValue as any}
          getValues={getValues as any}
        />
      </div>
    </div>
  );
}

export default ReturnGroups;
