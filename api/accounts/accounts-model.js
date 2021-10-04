const db = require('../../data/db-config')

const getAll = () => {
  return db('accounts')
  .select('id', 'name', 'budget')
}

const getById = id => {
  return db('accounts')
    .where('id', id)
    .first()
}

async function create(account) {
  const [id] = await db('accounts')
    .insert(account)
  return getById(id)
}

async function updateById(id, account) {
  await db('accounts')
    .update(account)
    .where('id', id)
  return getById(id)
}

async function deleteById(id) {
  const chopped = await getById(id)
  await db('accounts')
    .where('id', id)
    .delete()
  return chopped
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
