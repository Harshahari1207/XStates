import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [states, setStates] = useState([]);
  const [stateName, setStateName] = useState("");
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);

  const handleCountry = (e) => {
    const getCountryName = e.target.value;
    setCountryName(getCountryName);
    setIsCountrySelected(true);
    setStates([]); // Reset states and cities when a new country is selected
    setCities([]);
    setStateName("");
    setCityName("");
    setIsStateSelected(false);
    setIsCitySelected(false);
  };

  const handleState = (e) => {
    const getStateName = e.target.value;
    setStateName(getStateName);
    setIsStateSelected(true);
    setCities([]); // Reset cities when a new state is selected
    setCityName("");
    setIsCitySelected(false);
  };

  const handleCity = (e) => {
    const getCityName = e.target.value;
    setCityName(getCityName);
    setIsCitySelected(true);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://crio-location-selector.onrender.com/countries");
        setCountries(response.data);
      } catch (error) {
        console.log("Error fetching countries:", error);
        setCountries([]); // Reset countries to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const fetchStates = async (country) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`);
      setStates(response.data);
    } catch (error) {
      console.log("Error fetching states:", error);
      setStates([]); // Reset states to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryName) {
      fetchStates(countryName);
    }
  }, [countryName]);

  const fetchCities = async (countryName, stateName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`
      );
      setCities(response.data);
    } catch (error) {
      console.log("Error fetching cities:", error);
      setCities([]); // Reset cities to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryName && stateName) {
      fetchCities(countryName, stateName);
    }
  }, [stateName]);

  return (
    <div>
      <h1>Select Location</h1>
      
      <select 
        disabled={isCitySelected}
        onChange={handleCountry} 
        value={countryName}
      >
        <option>Select Country</option>
        {countries.map((country, id) => (
          <option key={id}>{country}</option>
        ))}
      </select>

      <select
        disabled={!isCountrySelected || isCitySelected}
        onChange={handleState}
        value={stateName}
      >
        <option>Select State</option>
        {states.map((state, id) => (
          <option key={id}>{state}</option>
        ))}
      </select>

      <select
        disabled={!isStateSelected}
        onChange={handleCity}
        value={cityName}
      >
        <option>Select City</option>
        {cities.map((city, id) => (
          <option key={id}>{city}</option>
        ))}
      </select>

      {isCitySelected && (
        <h5>{`You selected ${cityName}, ${stateName}, ${countryName}`}</h5>
      )}
    </div>
  );
};

export default Home;
