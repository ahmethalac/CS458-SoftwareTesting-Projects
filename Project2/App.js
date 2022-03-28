import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button, Picker, ScrollView } from 'react-native';
import { Input, Card } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const formatDateWithZeros = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
}

export default function App() {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    city: "",
    gender: "",
    vaccineType: "",
    sideEffect: "",
    extra: ""
  });

  const isValidResponse = !Object.values(data).some(property => property === "");

  const setInfo = infoType => info => setData({ ...data, [infoType]: info });
  return (
    <View style={styles.container}>
      <Card wrapperStyle={styles.survey}>
        <Card.Title>Vaccine Survey</Card.Title>
        <Card.Divider />
        <ScrollView>
          <View style={styles.row}>
            <Input
              accessibilityLabel='nameInput'
              leftIcon={<Icon name="account-outline" size={20}/>}
              placeholder="Enter name"
              label="Name"
              containerStyle={{ width: '48%'}}
              inputStyle={{ fontSize: 12 }}
              placeholderTextColor="black"
              onChangeText={setInfo('name')}
            />
            <Input 
              accessibilityLabel='surnameInput'
              leftIcon={<Icon name="account-outline" size={20}/>}
              placeholder="Enter surname"
              label="Surname"          
              containerStyle={{ width: '48%' }}
              inputStyle={{ fontSize: 12 }}
              placeholderTextColor="black"
              onChangeText={setInfo('surname')}
            />
          </View>
          <View style={styles.row}>
            <Input
              leftIcon={<Icon name="calendar-range" size={20}/>}
              label="Birth Date"
              containerStyle={{ width: '48%'}}
              InputComponent={() => <Text
                accessibilityLabel='birthDateText'
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    onChange: (event, date) => {
                      setData({ ...data, birthDate: date });
                    },
                    mode: 'date'
                  })
                }}
                style={{ fontSize: 12, color: 'black' }}
              >
                {data.birthDate ? formatDateWithZeros(data.birthDate) : 'Enter birth date'}
              </Text>}
            />
            <Input 
              leftIcon={<Icon name="home-city" size={20}/>}
              placeholder="Enter city"
              label="City"          
              containerStyle={{ width: '48%' }}
              inputStyle={{ fontSize: 12 }}
              placeholderTextColor="black"
              onChangeText={setInfo('city')}
            />
          </View>
          <View style={styles.row}>
            <Input 
              leftIcon={<Icon name="gender-male-female" size={20}/>}
              label="Gender"          
              containerStyle={{ width: '48%' }}
              InputComponent={() => 
                <Picker
                  style={{ height: 20, width: '90%' }}
                  onValueChange={setInfo('gender')}
                  selectedValue={data.gender}
                  accessibilityLabel="genderPicker"
                  prompt="Please select your gender"
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              }
            />
            <Input 
              leftIcon={<Icon name="medical-bag" size={20}/>}
              label="Vaccine Type"          
              containerStyle={{ width: '48%' }}
              InputComponent={() => 
                <Picker
                  style={{ height: 20, width: '90%'}}
                  onValueChange={setInfo('vaccineType')}
                  selectedValue={data.vaccineType}
                  accessibilityLabel="vaccineTypePicker"
                  prompt="Please select your vaccine type"
                >
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="BionTech" value="biontech" />
                  <Picker.Item label="Sinovac" value="sinovac" />
                </Picker>
              }
            />
          </View>
          <Input 
              leftIcon={<Icon name="pill" size={20}/>}
              placeholder="Please enter any side effects after the vaccine"
              label="Side Effects"
              inputStyle={{ fontSize: 12 }}
              placeholderTextColor="black"
              onChangeText={setInfo('sideEffect')}
              multiline
          />
          <Input 
              leftIcon={<Icon name="test-tube" size={20}/>}
              placeholder="Please enter any PCR positive cases and Covid-19 symptoms after the 3rd dose"
              label="Positive Cases or Symptoms"
              inputStyle={{ fontSize: 12 }}
              placeholderTextColor="black"
              onChangeText={setInfo('extra')}
              multiline
          />
        </ScrollView>
        {isValidResponse && <Button onPress={() => console.log(data)} title='Send' />}
        <StatusBar style="auto" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#ddd'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameInputContainer: {
    width: '48%',
  },
});
