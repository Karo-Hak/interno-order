
const ViewProfilSection: React.FC<any> = ({ room }: any) => {





  return (<>
    {
      room.groupedProfils ?
        <table className="table tableSection" key={room.id}>
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Պրոֆիլ</th>
              <th >Գին</th>
              <th >Գ/Մ</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedProfils && Object.keys(room.groupedProfils).map((key) => {
              if (typeof room.groupedProfils[key] === 'object' && room.groupedProfils[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedProfils[key].profilName}</td>
                  <td>{room.groupedProfils[key].profilPrice}</td>
                  <td>{room.groupedProfils[key].profilQuantity}</td>
                </tr>

              }
              return null;
            })}
          </tbody>
        </table>
        : null
    }
  </>);
};

export default ViewProfilSection;
