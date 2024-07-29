import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Modal, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../Utils/config';
import predicted from '../../assets/predicted.png';

const PredictPriceScreen = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engineType, setEngineType] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [previousOwners, setPreviousOwners] = useState('');
  const [additionalFeatures, setAdditionalFeatures] = useState('');
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPredict, setIsPredict] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [carDetails, setCarDetails] = useState({});

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!make) errors.make = 'Make is required';
    if (!model) errors.model = 'Model is required';
    if (!year || isNaN(year)) errors.year = 'Valid year is required';
    if (!country) errors.country = 'Country of origin is required';
    if (!transmission) errors.transmission = 'Transmission type is required';
    if (!engineType) errors.engineType = 'Engine type is required';
    if (!engineSize || isNaN(engineSize)) errors.engineSize = 'Valid engine size is required';
    if (!mileage || isNaN(mileage)) errors.mileage = 'Valid mileage is required';
    if (!condition) errors.condition = 'Condition is required';
    if (!previousOwners || isNaN(previousOwners)) errors.previousOwners = 'Valid number of previous owners is required';
    if (!additionalFeatures) errors.additionalFeatures = 'Additional features are required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsPredict(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${base_url}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: make,
          model: model,
          year: parseInt(year) || 0,
          country_of_origin: country,
          transmission: transmission,
          engine_type: engineType,
          engine_size: parseFloat(engineSize) || 0,
          mileage: parseFloat(mileage) || 0,
          condition: condition,
          previous_owners: parseInt(previousOwners) || 0,
          additional_features: additionalFeatures
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPredictedPrice(data.prediction);
        setCarDetails({
          make, model, year, country, transmission, engineType, engineSize, mileage, condition, previousOwners, additionalFeatures
        });
        setIsModalVisible(true);
      } else {
        setErrorMessage(data.message || 'Failed to predict price.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsPredict(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ModalComponent 
        isModalVisible={isModalVisible} 
        handleModalClose={handleModalClose} 
        predictedPrice={predictedPrice} 
        carDetails={carDetails}
      />
      {errorMessage ?
        <Modal visible={true} animationType="slide">
          <View style={styles.container}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={() => setErrorMessage('')}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        : null}

      <Text style={styles.title}>Predict Vehicle Resale Price</Text>
      <TextInput style={styles.input} placeholder="Make" value={make} onChangeText={setMake} />
      {errors.make && <Text style={styles.errorText}>{errors.make}</Text>}
      
      <TextInput style={styles.input} placeholder="Model" value={model} onChangeText={setModel} />
      {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
      
      <TextInput style={styles.input} placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" />
      {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
      
      <TextInput style={styles.input} placeholder="Country of Origin" value={country} onChangeText={setCountry} />
      {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      
      <Picker selectedValue={transmission} style={styles.input} onValueChange={(itemValue) => setTransmission(itemValue)}>
        <Picker.Item label="Select Transmission" value="" />
        <Picker.Item label="Manual" value="Manual" />
        <Picker.Item label="Automatic" value="Automatic" />
      </Picker>
      {errors.transmission && <Text style={styles.errorText}>{errors.transmission}</Text>}
      
      <TextInput style={styles.input} placeholder="Engine Type" value={engineType} onChangeText={setEngineType} />
      {errors.engineType && <Text style={styles.errorText}>{errors.engineType}</Text>}
      
      <TextInput style={styles.input} placeholder="Engine Size (L)" value={engineSize} onChangeText={setEngineSize} keyboardType="numeric" />
      {errors.engineSize && <Text style={styles.errorText}>{errors.engineSize}</Text>}
      
      <TextInput style={styles.input} placeholder="Mileage (km)" value={mileage} onChangeText={setMileage} keyboardType="numeric" />
      {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
      
      <Picker selectedValue={condition} style={styles.input} onValueChange={(itemValue) => setCondition(itemValue)}>
        <Picker.Item label="Select Condition" value="" />
        <Picker.Item label="Poor" value="Poor" />
        <Picker.Item label="Fair" value="Fair" />
        <Picker.Item label="Good" value="Good" />
        <Picker.Item label="Excellent" value="Excellent" />
      </Picker>
      {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
      
      <TextInput style={styles.input} placeholder="Previous Owners" value={previousOwners} onChangeText={setPreviousOwners} keyboardType="numeric" />
      {errors.previousOwners && <Text style={styles.errorText}>{errors.previousOwners}</Text>}
      
      <TextInput style={styles.input} placeholder="Additional Features" value={additionalFeatures} onChangeText={setAdditionalFeatures} />
      {errors.additionalFeatures && <Text style={styles.errorText}>{errors.additionalFeatures}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>
          {isPredict ? <ActivityIndicator size="small" color="white" /> : "Predict Price"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ModalComponent = ({ isModalVisible, handleModalClose, predictedPrice, carDetails }) => {
  return (
    <Modal visible={isModalVisible} animationType="slide">
      <View style={styles.container}>
        <Image source={predicted} style={styles.logo} />
        <Text style={styles.title}>Predicted Price</Text>
        <Text style={styles.priceText}>Shs. {predictedPrice}</Text>
        <Text style={styles.title}>Car Details</Text>
        <Text style={styles.detailsText}>Make: {carDetails.make}</Text>
        <Text style={styles.detailsText}>Model: {carDetails.model}</Text>
        <Text style={styles.detailsText}>Year: {carDetails.year}</Text>
        <Text style={styles.detailsText}>Country: {carDetails.country}</Text>
        <Text style={styles.detailsText}>Transmission: {carDetails.transmission}</Text>
        <Text style={styles.detailsText}>Engine Type: {carDetails.engineType}</Text>
        <Text style={styles.detailsText}>Engine Size: {carDetails.engineSize} L</Text>
        <Text style={styles.detailsText}>Mileage: {carDetails.mileage} km</Text>
        <Text style={styles.detailsText}>Condition: {carDetails.condition}</Text>
        <Text style={styles.detailsText}>Previous Owners: {carDetails.previousOwners}</Text>
        <Text style={styles.detailsText}>Additional Features: {carDetails.additionalFeatures}</Text>
        <TouchableOpacity style={styles.button} onPress={handleModalClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 5,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default PredictPriceScreen;
