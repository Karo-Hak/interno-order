import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { CoopStretchOrderProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const ViewCoopStretchOrderPDF = (order: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Name: asd</Text>
                <Text>Email:asdfsfsf</Text>
            </View>
        </Page>
    </Document>
);

export default ViewCoopStretchOrderPDF;
