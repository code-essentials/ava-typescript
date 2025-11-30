import test from 'ava'
import { CONSTANT } from '../test/res1.js'

test("test runs", t => t.pass())

test("test to debug", t => {
    debugger
    t.pass()
})

test("test/ directory", t => {
    t.is(CONSTANT, "123")
})
