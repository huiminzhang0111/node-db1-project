const Account = require('./accounts-model')
const yup = require('yup')

const nameSchema = yup.object().shape({
  name: yup
    .string()
    .typeError("name of account must be a string")
    .trim()
    .min(3)
    .max(100, "name of account must be between 3 and 100")
})

const budgetSchema = yup.object().shape({
  budget: yup
    .number()
    .min(0)
    .max(1000000, )
})

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
  } else if (typeof budget !== 'number') {
    res.status(400).json({message: "budget of account must be a number"})
  } else if (budget < 0 || budget > 100) {
    res.status(400).json({message: "budget of account is too large or too small"})
  } else {
    next()
  }
}

async function checkAccountNameUnique(req, res, next) {
  const { name } = req.body
  if (!name || typeof name !== 'string' || !name.trim()) {
    next ({ code: 400, message: 'name is required' })
  } else {
    next()
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