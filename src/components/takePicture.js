exports.screenshot = async function (pictureName,page) {
    await page.screenshot({path: `./screenshots/${pictureName}`});
    console.log("‡‡‡ "+`screenshots/${pictureName}`+" ‡‡‡")
}