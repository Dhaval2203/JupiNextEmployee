import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    iconLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        marginLeft: 10,
    },
    iconBox: {
        width: 12,
        height: 12,
        marginRight: 6,
        marginTop: 2,
    },
});

export function renderIconList(items) {
    return items.map((item, index) => (
        <View key={index} style={styles.iconLine}>
            <Image
                src="/JupiNextIcon.png"
                alt="Checkmark Icon"
                style={styles.iconBox}
            />
            <Text>{item}</Text>
        </View>
    ));
}
