
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
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {room.groupedProfils && Object.keys(room.groupedProfils).map((key) => {
              if (typeof room.groupedProfils[key] === 'object' && room.groupedProfils[key] !== null) {
                return <tr key={key}>
                  <td>{room.groupedProfils[key].name}</td>
                  <td>{room.groupedProfils[key].price}</td>
                  <td>{room.groupedProfils[key].quantity}</td>
                  <td>{room.groupedProfils[key].sum}</td>
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
