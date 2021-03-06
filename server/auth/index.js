const router = require('express').Router()
const User = require('../db/models/user')
const Cart = require('../db/models/cart')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    console.log('BODY', req.body)
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      if (
        !await Cart.findOne({
          where: {
            userId: user.id
          }
        }) &&
        req.body.shoppingCart
      ) {
        const currCart = await Cart.create(req.body.shoppingCart)
        await currCart.setUser(user.id)
        req.body.shoppingCart.products.forEach(async prod => {
          await currCart.addProduct(prod.id, {
            through: {itemAmount: prod.quantity}
          })
        })
      }
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    if (req.body.shoppingCart) {
      const currCart = await Cart.create(req.body.shoppingCart)
      await currCart.setUser(user.id)
      console.log('CART', currCart)

      req.body.shoppingCart.products.forEach(async prod => {
        await currCart.addProduct(prod.id, {
          through: {itemAmount: prod.quantity}
        })
      })
    }
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
