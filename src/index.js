import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import countriesListMarkupTpl from './templates/countries-list.hbs';
import countryCardMarkup from "./templates/country-info.hbs";
import Notiflix from "notiflix";
import 'modern-normalize/modern-normalize.css';
import './sass/main.scss';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  counrtyList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info')
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(evt) {
  const inputValueToLowerCase = (evt.target.value).toLowerCase().trim();

  if (inputValueToLowerCase === '') {
    clearMarkup();

    return
  }
  
  fetchCountries(inputValueToLowerCase).then((countries) => {
    const country = countries[0];
    const languagesString = country.languages.map(language => language.name).join(', ');

    if (countries.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

      clearMarkup();
    }

    if (countries.length >= 2 && countries.length <= 10) {
      const markup = countriesListMarkupTpl(countries);

      makeCountriesListMarkup(markup);
    }

    if (countries.length === 1) {
      const markup = countryCardMarkup({country: countries[0], languagesString});

      makeCountryCardMarkup(markup);
    }
  }).catch(error => {
    Notiflix.Notify.failure('Oops, there is no country with that name')
    clearMarkup()
  });

}

function clearMarkup() { 
  refs.countryInfo.innerHTML = '';
  refs.counrtyList.innerHTML = '';
}

function makeCountriesListMarkup(markup) {
  clearMarkup();

  refs.counrtyList.innerHTML = markup;
}

function makeCountryCardMarkup(markup) {
  clearMarkup();

  refs.countryInfo.innerHTML = markup;
}