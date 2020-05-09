import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';
import ScrollToTop from './ScrollToTop';

const App = () => (
  <BrowserRouter>
    <ScrollToTop>
      <MainRouter />
    </ScrollToTop>
  </BrowserRouter>
);


export default App;
