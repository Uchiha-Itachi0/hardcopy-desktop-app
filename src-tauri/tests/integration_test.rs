// src-tauri/tests/integration_test.rs

use hardcopy_desktop_app::greet;

#[test]
fn test_greet() {
    let name = "Radha";
    let result = greet(name);
    assert_eq!(result, "Hello, Radha! You've been greeted from Krishna!");
}