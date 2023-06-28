import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import { Home } from './components/Home';
import { AppMenu } from './components/Menu';
import { DogsDetails } from './components/dogs/DogsDetails';
import { DogsDelete } from './components/dogs/DogsDelete';
import { DogsAdd } from './components/dogs/DogsAdd';
import { DogsShowAll } from './components/dogs/DogsShowAll';
import { DogsUpdate } from './components/dogs/DogsUpdate';
import { DogsFilter } from './components/dogs/DogsFilter';
import { ToysShowAll } from './components/toys/ToysShowAll';
import { ToysDetails } from './components/toys/ToysDetails';
import { ToysAdd } from './components/toys/ToyAdd';
import { ToysUpdate } from './components/toys/ToysUpdate';
import { ToysDelete } from './components/toys/ToyDelete';
import { OwnersAdd } from './components/owners/OwnerAdd';
import { OwnersShowAll } from './components/owners/OwnersShowAll';
import { OwnersDetails } from './components/owners/OwnersDetails';
import { OwnersUpdate } from './components/owners/OwnersUpdate';
import { OwnersDelete } from './components/owners/OwnersDelete';
import { DogOwnersShowAll } from './components/dogowners/DogOwnersShowAll';
import { DogOwnersDetails } from './components/dogowners/DogOwnersDetails';
import { DogOwnersAdd } from './components/dogowners/DogOwnersAdd';
import { DogOwnerUpdate } from './components/dogowners/DogOwnersUpdate';
import { DogOwnersDelete } from './components/dogowners/DogOwnersDelete';
import { DogsStats } from './components/dogs/DogsStats2';
import { LoginForm } from './components/login';
import { ActivateAccount } from './components/activate';
import { RegisterForm } from './components/register';
import { UserDetails } from './components/UserDetails';

function App() {
  const [count, setCount] = useState(0)

  return (
 /*   <React.Fragment>
      <DogsShowAll/>
        <div className="App">
          
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
    </React.Fragment>
    */
   <div style={{ backgroundColor: 'rgb(52, 52, 52)'}}>
    <React.Fragment >
			<Router>
        <AppMenu />
				<Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/activate/:confirmation_code" element={<ActivateAccount />} />
        <Route path="/user/details/:userId" element={<UserDetails />} />
					<Route path="/" element={<Home />} />
          <Route path="/dogs" element={<DogsShowAll />} />
          <Route path="/dogs/:dogId/details" element={<DogsDetails />} />
					<Route path="/dogs/:dogId/edit" element={<DogsUpdate />} />
					<Route path="/dogs/:dogId/delete" element={<DogsDelete />} />
					<Route path="/dogs/add" element={<DogsAdd />} />
          <Route path="/dogs/avg-by-toy-price" element={<DogsFilter />} />
          <Route path="/dogs/nr-of-owners" element={<DogsStats />} />
          
          <Route path="/toys" element={<ToysShowAll />} />
          <Route path="/toys/:toyId/details" element={<ToysDetails />} />
          <Route path="/toys/:toyId/edit" element={<ToysUpdate />} />
          <Route path="/toys/:toyId/delete" element={<ToysDelete />} />
          <Route path="/toys/add" element={<ToysAdd />} />


          <Route path="/owners" element={<OwnersShowAll />} />
          <Route path="/owners/:ownerId/details" element={<OwnersDetails />} />
          <Route path="/owners/:ownerId/edit" element={<OwnersUpdate />} />
          <Route path="/owners/:ownerId/delete" element={<OwnersDelete />} />
          <Route path="/owners/add" element={<OwnersAdd />} />

          <Route path="/dogowners" element={<DogOwnersShowAll />} />
          <Route path="/dogowners/:dogId/:ownerId/details" element={<DogOwnersDetails />} />
          <Route path="/dogowners/:dogId/:ownerId/edit" element={<DogOwnerUpdate />} />
          <Route path="/dogowners/:dogId/:ownerId/delete" element={<DogOwnersDelete />} />
          <Route path="/dogowners/add" element={<DogOwnersAdd />} />
				</Routes>
      
			</Router>
      
		</React.Fragment>
    </div>


  )
}

export default App
