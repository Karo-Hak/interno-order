
const ViewLightPlatformSection: React.FC<any> = ({ room }: any) => {





  return (<>
    {
      room.groupedLightPlatforms ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Լ. Պլատֆորմ</th>
              <th >Գին</th>
              <th >Հատ</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedLightPlatforms && Object.keys(room.groupedLightPlatforms).map((key) => {
              if (typeof room.groupedLightPlatforms[key] === 'object' && room.groupedLightPlatforms[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedLightPlatforms[key].lightPlatformName}</td>
                  <td>{room.groupedLightPlatforms[key].lightPlatformPrice}</td>
                  <td>{room.groupedLightPlatforms[key].lightPlatformQuantity}</td>
                </tr>
              }
              return null;
            })}
          </tbody>
        </table >
        : null
    }
  </>);
};

export default ViewLightPlatformSection;
