import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect, useState } from "react";
import ModalPlintOrderType from "../modal/ModalPlintOrderType";

interface PlintMenuProps {

}

export const PlintMenu: React.FC<PlintMenuProps> = (): JSX.Element => {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })


    }, [])

    const plintBuyer = () => {
        navigate("/plint/plintBuyer")
    }
    const plintBuyerNewWindow = () => {
        window.open("/plint/plintBuyer")
    }
    const plintCoop = () => {
        navigate("/plint/plintCoop")
    }
    const plintCoopNewWindow = () => {
        window.open("/plint/plintCoop")
    }
    const plintAgent = () => {
        navigate("/plint/plintAgent")
    }
    const plintAgentNewWindow = () => {
        window.open("/plint/plintAgent")
    }
    const addPlint = () => {
        navigate("/plint/addPlint")
    }
    const addPlintNewWindow = () => {
        window.open("/plint/addPlint")
    }

    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        if (event.target.value !== "Ապրանք") {
            navigate(event.target.value)
        }

    }

    const newPlintOrder = () => {
        navigate("/plint/plintOrder")
    }
    const newPlintOrderNewWindow = () => {
        window.open("/plint/plintOrder")
    }
    const stockPlint = () => {
        navigate("/plint/stockPlint")
    }
    const stockPlintNewWindow = () => {
        window.open("/plint/stockPlint")
    }
    const Input_outputPlint = () => {
        navigate("/plint/inputOutputPlint")
    }
    const Input_outputPlintNewWindow = () => {
        window.open("/plint/inputOutputPlint")
    }

    const home = () => {
        navigate("/plint/homepage")
    }

    const plintProduction = () => {
        navigate("/plint/plintProduction")
    }
    const plintProductionNewWindow = () => {
        window.open("/plint/plintProduction")
    }
    const viewPlintOrders = () => {
        navigate("/plint/viewPlintOrdersList")
    }

    const viewPlintOrdersNewWindow = () => {
        window.open("/plint/viewPlintOrdersList")
    }

    const viewMaterialsOrders = () => {
        navigate("/plint/viewMaterial")
    }

    const viewMaterialsOrdersNewWindow = () => {
        window.open("/plint/viewMaterial")
    }

    const viewDebetKredit = () => {
        navigate("/plint/debet-kredit")
    }

    const viewDebetKreditNewWindow = () => {
        window.open("/plint/viewMaterial")
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="admin_profile">
            <div style={{
                textAlign: 'left',
                width: "10%"
            }}>
                <button className="btn" onClick={home} >Գլխավոր Էջ</button>
            </div>
            <div className="admin_profile">
                <button className="btn" onClick={handleOpenModal} >Նոր Պատվեր</button>
                <button className="btn" onClick={plintBuyer} onContextMenu={plintBuyerNewWindow}> + Գնորդ</button>
                <button className="btn" onClick={plintCoop} onContextMenu={plintCoopNewWindow}> + Գործընկեր</button>
                <button className="btn" onClick={plintAgent} onContextMenu={plintAgentNewWindow}> + Միջնորդ</button>
                <button className="btn" onClick={addPlint} onContextMenu={addPlintNewWindow}> + Շրիշակ</button>
                <button className="btn" onClick={stockPlint} onContextMenu={stockPlintNewWindow}>Պահեստ</button>
                <button className="btn" onClick={plintProduction} onContextMenu={plintProductionNewWindow}>Արտադրություն</button>
                <button className="btn" onClick={Input_outputPlint} onContextMenu={Input_outputPlintNewWindow}>Գույքագրում</button>
                <button className="btn" onClick={viewPlintOrders} onContextMenu={viewPlintOrdersNewWindow}>Դիտել Պատվերները</button>
                <button className="btn" onClick={viewMaterialsOrders} onContextMenu={viewMaterialsOrdersNewWindow}>Նյութածախս</button>
                <button className="btn" onClick={viewDebetKredit} onContextMenu={viewDebetKreditNewWindow}>Դեբետ/Կրեդիտ</button>
            </div>
            <div style={{ width: "10%" }}></div>
            <ModalPlintOrderType isOpen={isModalOpen} onClose={handleCloseModal} />

        </div>
    )
}