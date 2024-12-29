import React, { useEffect, useState } from 'react';
import { Page, View, Document, StyleSheet, Text, Font } from '@react-pdf/renderer';

// Register the custom font
Font.register({
    family: 'ArmenianFont',
    src: '/ArmenianFont.ttf'  // Ensure this path matches where the font is hosted
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    code: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        textAlign: "center",
        marginBottom: 3,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    buyer: {
        textAlign: "center",
        marginBottom: 5,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    payment: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        textAlign: "center",
        marginTop: 3,
        marginBottom: 3,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    container: {
        padding: 10,
        marginBottom: 20,
        border: '1px solid black',
        borderRadius: 5,
    },
    table: {
        width: "100%",
    },
    tableRow: {
        display: "flex",
        flexDirection: "row",
    },
    tableColHeader: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        padding: 5,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    tableCol: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#bfbfbf',
        textAlign: 'center',
        padding: 5,
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    tableCell: {
        fontSize: 10,
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    section: {
        margin: 10,
        flexGrow: 1,
    },
});

const parseDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()}`;
}

const ViewStretchOrderPDF = ({ order }: any) => {

    const [rooms, setRooms] = useState<any>(() => {
        let initialState: any = {}
        if (order.rooms && typeof order.rooms === "object") {
            initialState = Object.values(order.rooms);
        }
        return initialState;
    });

    const [orderObj, setOrderObj] = useState<any>(() => {
        let initialState: any[] = [];
        if (rooms.length > 0) {
            rooms.forEach((order: any) => {
                for (const [elWork, valueWork] of Object.entries(order)) {
                    if (valueWork !== null && typeof valueWork === "object" && !Array.isArray(valueWork)) {
                        initialState.push(...Object.values(valueWork));
                    }
                }
            });
        }
        return initialState;
    });

    const [orderSum, setOrderSum] = useState<any>({});
    useEffect(() => {
        if (orderObj.length > 0) {
            const newOrderSum: any = {};
            orderObj.forEach((element: any) => {
                if (!newOrderSum[element.type]) {
                    newOrderSum[element.type] = [];
                }
                let existingItem = newOrderSum[element.type].find((item: any) => item.name === element.name);
                if (!existingItem) {
                    newOrderSum[element.type].push({ "name": element.name, "quantity": parseFloat(element.quantity), "type": element.type });
                } else {
                    const totalQuantity = (parseFloat(existingItem.quantity) * 100 + parseFloat(element.quantity) * 100) / 100;
                    existingItem.quantity = totalQuantity.toFixed(2);
                }
            });
            setOrderSum(newOrderSum);
        }
    }, [orderObj]);



    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.code}>
                    <Text>{order.code}</Text>
                    <Text>Ամսաթիվ - {parseDate(order.date)}</Text>
                    <Text>Աշխատակից - {order.stWorker.name}</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.buyer}>
                        <Text>
                            Գնորդ - {order.buyer.buyerName} /
                            {order.buyer.buyerRegion} {order.buyer.buyerAddress} /-
                            {order.buyer.buyerPhone1}-{order.buyer.buyerPhone2}
                        </Text>
                    </View>
                    <View style={styles.payment}>
                        <Text>Գումար - {order.balance}</Text>
                        <Text>Կանխավճար - {order.prepayment}</Text>
                        <Text>Մնացորդ - {order.groundTotal}</Text>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableColHeader}><Text>Անվանում</Text></View>
                                <View style={styles.tableColHeader}><Text>Քանակ</Text></View>
                            </View>
                            {Object.entries(orderSum).length > 0 &&
                                Object.entries(orderSum).map(([type, items]: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {items.map((item: any, itemIndex: number) => (
                                            <View style={styles.tableRow} key={itemIndex}>
                                                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.type} - {item.name}</Text></View>
                                                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                                            </View>
                                        ))}
                                    </React.Fragment>
                                ))}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ViewStretchOrderPDF;
