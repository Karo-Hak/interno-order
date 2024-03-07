
const ViewLightRingSection: React.FC<any> = ({ room }: any) => {





  return (<>
    {
      room.groupedLightRings ?
        < table className="table tableSection" key={room.id} >
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Լ. Օղակ</th>
              <th >Գին</th>
              <th >Հատ</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedLightRings && Object.keys(room.groupedLightRings).map((key) => {
              if (typeof room.groupedLightRings[key] === 'object' && room.groupedLightRings[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedLightRings[key].lightRingName}</td>
                  <td>{room.groupedLightRings[key].lightRingPrice}</td>
                  <td>{room.groupedLightRings[key].lightRingQuantity}</td>
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

export default ViewLightRingSection;
