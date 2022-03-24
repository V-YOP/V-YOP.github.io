
/**
 * iterate : (a => a) => a => number => [a]
 */
const iterate = fn => init => time => {
  if (time < 0) throw new Error("invalid argument time: " + time)
  if (time === 0) return []
  return [init, ...iterate(fn)(fn(init))(time - 1)]
}

/**
 * cycle : [a] => number => [a]
 */
const cycle = lst => time => {
  if (lst == null || lst.length === 0) throw new Error("cycled list can't be null or empty")
  return iterate(x => (x + 1) % lst.length)(0)(time).map(i => lst[i])
}

/**
 * flip : (a => b => c) => b => a => c
 */
const flip = fn => b => a => fn(a)(b)

const identity = a => a;

const constant = a => b => a

const head = ([x, ...xs])=> x
const tail = ([x, ...xs]) => xs


/**
 * plus : number => number => number
 */
const plus = x => y => x + y

/**
 * sub : number => number => number
 */
const sub = x => y => x - y

/**
 * div : number => number => number
 */
const div = x => y => x / y

/**
 * multiply : number => number => number
 */
const multiply = x => y => x * y

/**
 * replicate : number => a => [a]
 */
const replicate = flip(iterate(identity))

/**
 * doTimes : number => (number => Unit) => Unit
 */
const doTimes = time => fn => {
  if (time < 0) throw new Error("invalid argument time: " + time)
  for (let i = 0; i < time; i++)
    fn(i)
}

/**
 * zipWith : (a => b => c) => [a] => [b] => [c]
 */
const zipWith = fn => lstA => lstB => {
  const [x, ...xs] = lstA
  const [y, ...ys] = lstB
  if (x == null || y == null) return []
  return [fn(x)(y), ...zipWith(fn)(xs)(ys)]
}

/**
 * zip : [a] => [b] => [(a, b)]
 */
const zip = zipWith(x => y => [x, y])

/**
 * zipWith3 : (a => b => c => d) => [a] => [b] => [c] => [d] 
 */
const zipWith3 = fn => lstA => lstB => lstC => {
  const [x, ...xs] = lstA
  const [y, ...ys] = lstB
  const [z, ...zs] = lstC
  if (x == null || y == null || z == null) return []
  return [fn(x)(y)(z), ...zipWith(fn)(xs)(ys)(zs)]
}

const zip3 = zipWith3(x => y => z => [x, y, z])

/**
 * foldl: (b => a => b) => b => [a] => b
 */
const foldl = fn => init => lst => {
  if (lst.length === 0) return init
  const [x, ...xs] = lst
  return foldl(fn)(fn(init)(x))(xs)
}

/**
 * foldr : (a => b => b) => b => [a] => b
 */
const foldr = fn => init => lst => {
  if (lst.length === 0) return init
  const [x, ...xs] = lst
  return fn(x)(foldr(fn)(init)(xs))
}


/**
 * sum : [number] => number
 */
const sum = foldl(plus)(0)

/**
 * product : [number] => number
 */
const product = foldl(multiply)(1)

/**
 * average : [number] => number
 */
const average = lst => sum(lst) / lst.length

/**
 * flatMap : (a => [b]) => [a] => [b]
 */
const flatMap = fn => lst => foldl(acc => x => [...acc, ...fn(x)])([])(lst)

/**
 * map : (a => b) => [a] => [b]
 */
const map = fn => lst => flatMap(x => [fn(x)])(lst)

/**
 * foreach : (a => Unit) => [a] => Unit
 */
const foreach = fn => compose(constant(null))(map(fn))

/**
 * filter : (a => bool) => [a] => [a]
 */
const filter = predicate => lst => flatMap(x => predicate(x) ? [x] : [])(lst)


/**
 * compose : (b => c) => (a => b) => (a => c)
 */
const compose = g => f => x => g(f(x))

/**
 * andThen : (a => b) => (b => c) => (a => c)
 */
const andThen = flip(compose)

/**
 * foldl1 : (a => a => a) => [a] => a
 */
const foldl1 = fn => ([x, ...xs]) => foldl(fn)(x)(xs)

/**
 * curry : ((a, b) => c) => a => b => c
 */
const curry = fn => a => b => fn(a, b)

/**
 * uncurry : (a => b => c) => ((a, b) => c)
 */
const uncurry = fn => (a, b) => fn(a)(b)

/**
 * curry : ((a, b, c) => d) => a => b => c => d
 */
const curry3 = fn => a => b => c => fn(a, b, c)

/**
 * uncurry3 : (a => b => c => d) => (a, b, c) => d
 */
const uncurry3 = fn => (a, b, c) => fn(a)(b)(c)

const composeList = (...fn) => fn.reduceRight(compose)


function flatten(obj) {
  const res = {}
  function helper(obj, prefix) {
    if (!obj || !obj instanceof Object) return

    const isArr = Array.isArray(obj)
    // 统一数组和obj的形式
    const entires = isArr ? obj.map((v, i) => [i, v]) : Object.entries(obj)
    entires.forEach(([key, value]) => {
      const nextKey = (prefix ? `${prefix}.` : '') + (isArr ? `[${key}]` : key)
      if (value instanceof Object) {
        helper(value, nextKey)
        return
      }
      res[nextKey] = value
    })
  }
  helper(obj)
  return res
}

const obj = {
  a: {
    b: 1,
    c: 2,
    d: { e: 5 }
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3
}

console.log(flatten(obj))