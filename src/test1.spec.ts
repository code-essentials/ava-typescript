import test from 'ava'

test("test runs", t => t.pass())

test("test to debug", t => {
    debugger
    t.pass()
})
