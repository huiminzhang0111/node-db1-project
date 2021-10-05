const dbConfig = require('../../data/db-config')
const Account = require('./accounts-model')

async function checkAccountPayload(req, res, next) {
  const { name, budget } = req.body
  if (name === undefined || budget === undefined) {
    res.status(400).json({
      message: "name and budget are required"
    })
  } else if (typeof name !== 'string') {
    res.status(400).json({message: "name of account must be a string"})
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({message: "name of account must be between 3 and 100"})
  } else if (typeof budget !== 'number' || isNaN(budget)) {
    res.status(400).json({message: "budget of account must be a number"})
  } else if (budget < 0 || budget > 1000000) {
    res.status(400).json({message: "budget of account is too large or too small"})
  } else {
    next()
  }
}

async function checkAccountNameUnique(req, res, next) {
  try {
    const existing = await dbConfig('accounts')
      .where('name', req.body.name.trim())
      .first()

    if (existing) {
      res.status(400).json({
        message: "that name is taken"
      })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

async function checkAccountId(req, res, next) {
  try {
    const possibleAccount = await Account.getById(req.params.id)
    if (possibleAccount) {
      req.account = possibleAccount
      next ()
    } else {
      next({ status: 404, message: "account not found" })
    }
  } catch (error) {
    next(error)
  }
}


module.exports = { checkAccountId, checkAccountPayload, checkAccountNameUnique }