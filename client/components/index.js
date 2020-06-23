/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {default as Profile} from './profile'
export {HomePage} from './homepage'
export {default as AllProducts} from './All-Products'
export {default as SingleProduct} from './Single-Product'
export {ConnectedCart} from './Cart-Checkout'
export {ConnectedCheckout} from './Checkout'
export {Login, Signup} from './auth-form'
