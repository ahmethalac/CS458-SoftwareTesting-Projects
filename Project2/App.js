import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button, Picker, ScrollView, LogBox, TouchableOpacity, Image } from 'react-native';
import { Input, Card, FAB } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

LogBox.ignoreAllLogs();

const getAge = (dateString) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

const formatDateWithZeros = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
}

const initialData = {
  name: "",
  surname: "",
  birthDate: "",
  city: "",
  gender: "",
  vaccineType: "",
  sideEffect: "",
  extra: ""
};

export default function App() {
  const [isSent, setIsSent] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initialData);

  const setInfo = infoType => info => {
    setData({ ...data, [infoType]: info });
    if (info !== "") {
      setErrors({ ...errors, [infoType]: "" });
    }
  };
  const setError = errorType => () => {
    if (data[errorType] === "") {
      setErrors({ ...errors, [errorType]: "This field is required" });
    } else {
      setErrors({ ...errors, [errorType]: "" });
    }
  };

  const isValidResponse = !Object.values(data).some(property => property === "") && Object.values(errors).every(error => error === "");

  const content = isSent ? (
    <View accessibilityLabel='successPage'>
      <Image source={require('./success.png')} style={{ width: '100%', height: 200, resizeMode: 'contain' }}/>
      <Text style={{ fontSize: 20, color: 'green', textAlign: 'center', paddingVertical: 30 }}>You've successfully sent the response. Thank you for participating!</Text>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            setData(initialData);
            setIsSent(false);
          }}
          accessibilityLabel='fillAgainButton'
          style={{...styles.button, backgroundColor: '#00b894'}}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Fill Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsSent(false);
          }}
          accessibilityLabel='editSubmissionButton'
          style={{...styles.button, backgroundColor: '#00b894'}}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Edit Submission</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (<>
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
          errorMessage={errors.name}
          onBlur={setError('name')}
          errorProps={{ accessibilityLabel: 'nameError' }}
          value={data.name}
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
          errorMessage={errors.surname}
          onBlur={setError('surname')}
          errorProps={{ accessibilityLabel: 'surnameError' }}
          value={data.surname}
        />
      </View>
      <View style={styles.row}>
        <Input
          leftIcon={<Icon name="calendar-range" size={20}/>}
          label="Birth Date"
          containerStyle={{ width: '48%'}}
          errorMessage={errors.birthDate}
          errorProps={{ accessibilityLabel: 'birthDateError' }}
          InputComponent={() => <Text
            accessibilityLabel='birthDateText'
            onPress={() => {
              DateTimePickerAndroid.open({
                value: data.birthDate || new Date(),
                onChange: (event, date) => {
                  setData({ ...data, birthDate: date });
                  if (getAge(date) < 18) {
                    setErrors({ ...errors, birthDate: "You must be 18 or older" });
                  } else {
                    setErrors({ ...errors, birthDate: "" });
                  }
                },
                mode: 'date',
              })
            }}
            style={{ fontSize: 12, color: 'black' }}
          >
            {data.birthDate ? formatDateWithZeros(data.birthDate) : 'Enter birth date'}
          </Text>}
        />
        <Input
          accessibilityLabel='cityInput'
          leftIcon={<Icon name="home-city" size={20}/>}
          placeholder="Enter city"
          label="City"          
          containerStyle={{ width: '48%' }}
          inputStyle={{ fontSize: 12 }}
          placeholderTextColor="black"
          onChangeText={setInfo('city')}
          errorMessage={errors.city}
          onBlur={setError('city')}
          errorProps={{ accessibilityLabel: 'cityError' }}
          value={data.city}
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
          accessibilityLabel='sideEffectInput'
          leftIcon={<Icon name="pill" size={20}/>}
          placeholder="Please enter any side effects after the vaccine"
          label="Side Effects"
          inputStyle={{ fontSize: 12 }}
          placeholderTextColor="black"
          onChangeText={setInfo('sideEffect')}
          value={data.sideEffect}
          multiline
          errorMessage={errors.sideEffect}
          errorProps={{ accessibilityLabel: 'sideEffectError' }}
          onBlur={setError('sideEffect')}
      />
      <Input 
          accessibilityLabel='extraInput'
          leftIcon={<Icon name="test-tube" size={20}/>}
          placeholder="Please mention any PCR positive cases and Covid-19 symptoms after the 3rd dose"
          label="Positive Cases or Symptoms"
          inputStyle={{ fontSize: 12 }}
          placeholderTextColor="black"
          onChangeText={setInfo('extra')}
          value={data.extra}
          multiline
          errorMessage={errors.extra}
          onBlur={setError('extra')}
          errorProps={{ accessibilityLabel: 'extraError' }}
      />
    </ScrollView>
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => {
          setData(initialData);
          setErrors(initialData);
        }}
        accessibilityLabel='resetButton'
        style={{...styles.button, backgroundColor: 'red'}}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Reset</Text>
      </TouchableOpacity>
      {isValidResponse && (
        <TouchableOpacity 
          onPress={() => setIsSent(true)} 
          style={{...styles.button, backgroundColor: 'blue'}}
          accessibilityLabel='sendButton'
        >
          <Text 
            style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}
          >
            Send
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </>);

  return (
    <View style={styles.container}>
      <Card wrapperStyle={styles.survey}>
        <Card.Title>Vaccine Survey</Card.Title>
        <Card.Divider />
        {content}
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
  survey: {
    height: '100%',
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    width: '48%',
  }
});
