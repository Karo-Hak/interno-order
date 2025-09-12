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
        marginBottom: 3,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'ArmenianFont', // Use the custom font here
    },
    buyer: {
        marginBottom: 5,
        fontSize: 14,
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
        fontSize: 14,
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
        fontSize: 14,
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
        fontSize: 14,
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

const ViewPlintOrderPDF = ({ order, plint }: any) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.code}>
                    <Text>{order.code}</Text>
                    <Text>Ամսաթիվ - {parseDate(order.date)}</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.buyer}>
                        <Text>
                            Գնորդ - {order.buyer.name} / <br></br>
                            Առ․ հեռ․ -  {order.deliveryPhone}
                        </Text>
                    </View>
                    <View style={styles.buyer}>
                        <Text>
                            Առ․ հասցե - {order.deliveryAddress}
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
                            {
                                <React.Fragment>
                                    {plint.map((item: any, itemIndex: number) => (
                                        <View style={styles.tableRow} key={itemIndex}>
                                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.name}</Text></View>
                                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                                        </View>
                                    ))}
                                </React.Fragment>
                            }
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ViewPlintOrderPDF;
