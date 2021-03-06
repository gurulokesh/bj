/**
 * Script Name: owrsynthetics
 * 
 *
 * Feel free to explore, or check out the full documentation
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-scripted-browsers
 * for details.
 */

/** CONFIGURATIONS **/

// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Script-wide timeout for all wait and waitAndFind functions (in ms)
var DefaultTimeout = 120000;
// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
var UserAgent = "default";

/** HELPER VARIABLES AND FUNCTIONS **/

var assert = require('assert'),
  By = $driver.By,
  browser = $browser.manage(),
  startTime = Date.now(),
  stepStartTime = Date.now(),
  prevMsg = '',
  prevStep = 0,
  lastStep = 9999,
VARS = {};

// VARS = {{scriptManualEntryData}};

var log = function(thisStep, thisMsg) {
  if (thisStep > 1 || thisStep == lastStep) {
    var totalTimeElapsed = Date.now() - startTime;
    var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;
    console.log('Step ' + prevStep + ': ' + prevMsg + ' FINISHED. It took ' + prevStepTimeElapsed + 'ms to complete.');
    $util.insights.set('Step ' + prevStep + ': ' + prevMsg, prevStepTimeElapsed);
    if (DefaultTimeout > 0 && totalTimeElapsed > DefaultTimeout) {
      throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + DefaultTimeout + 'ms.');
    }
  }
  if (thisStep > 0 && thisStep != lastStep) {
    stepStartTime = Date.now() - startTime;
    console.log('Step ' + thisStep + ': ' + thisMsg + ' STARTED at ' + stepStartTime + 'ms.');
    prevMsg = thisMsg;
    prevStep = thisStep;
  }
};

//POPUP CHECKER FUNCTIONS START

function elementIsPresent(ele) {
  return $browser.findElements(ele).then(function(found) {
    return found.length > 0;
  })
}

var owrstatus = elementIsPresent(By.className("serviceAlerts-status"));

//POPUP CHECKER FUNCTIONS END /OneWeb Retail status

/** BEGINNING OF SCRIPT **/

console.log('Starting synthetics script: owrsynthetics');
console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');
console.log('Variables set in this script: ', VARS);

// Setting User Agent is not then-able, so we do this first (if defined and not default)
if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
  $browser.addHeader('User-Agent', UserAgent);
  console.log('Setting User-Agent to ' + UserAgent);
}

// Get browser capabilities and do nothing with it, so that we start with a then-able command
$browser.getCapabilities().then(function () { })

// Step 1
.then(function() {
  log(1, 'Launching OWR Website)');
  return $browser.get("https://oneweb.thomascook.com/otaretail/search/login"); })

// Step 2
.then(function() {
  log(2, 'Logging in as Guest"');
  return $browser.waitForAndFindElement(By.id("testLogin"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 21
.then(function () {
  log(21, 'verifyTextPresent "ONEWEB RETAIL STATUS"');
  $browser.findElement(By.tagName('body')).getText().then(function (text) { return text.indexOf("ONEWEB RETAIL STATUS") != -1; }).then(function (bool) {
    if (!bool) {
      console.log('verifyTextPresent FAILED.');
      $browser.takeScreenshot();
    } else {
      console.log('verifyTextPresent SUCCEEDED.');
    }
  });
})

// Step 2.1 Invite POP UP CHECK POINT
.then(function(){
log(2.1,'Close Signup Invite Popup');
	return elementIsPresent(By.className("serviceAlerts-status")); })
	.then(function(owrstatus){
		if(owrstatus === true) {
			console.log(owrstatus+ "Item located");
	return $browser.findElement(By.xpath("//div[@id=\'statusMsgModal\']//button[.=\'Close\']"))
	.then(function(el){	el.click();	});}})

// Step 3
.then(function() {
  log(3, 'Entering Destination');
  return $browser.waitForAndFindElement(By.xpath("//div[@id=\'acrwhereGoKey\']/div/input"), DefaultTimeout); })
.then(function (el) {
  el.clear();
  el.sendKeys("Destinations"); })

// Step 6
.then(function() {
  log(6, 'Clicking on Destination All from the list');
  return $browser.waitForAndFindElement(By.css("div.ms-res-item.ms-res-item-active"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 3
.then(function() {
  log(3, 'clickElement "acrFromCalendarIcon"');
  return $browser.waitForAndFindElement(By.id("acrFromCalendarIcon"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 4
.then(function() {
  log(4, 'setElementSelected "//select[@class=\'ui-datepicker-year\']//option[2]"');
  return $browser.waitForAndFindElement(By.xpath("//select[@class=\'ui-datepicker-year\']//option[2]"), DefaultTimeout); })
.then(function(el) { el.isSelected()
  .then(function(bool) { if (!bool) { el.click(); } }); })

// Step 5
.then(function() {
  log(5, 'clickElement "1"');
  return $browser.waitForAndFindElement(By.linkText("1"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 6
.then(function() {
  log(6, 'clickElement "acrToCalendarIcon"');
  return $browser.waitForAndFindElement(By.id("acrToCalendarIcon"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 7
.then(function() {
  log(7, 'clickElement "28"');
  return $browser.waitForAndFindElement(By.linkText("28"), DefaultTimeout); })
.then(function (el) { el.click(); })


// Step 5
.then(function() {
  log(5, 'Clicking on Search Package');
  return $browser.waitForAndFindElement(By.id("acrProductSearch"), DefaultTimeout); })
.then(function (el) { el.click(); })


// Step 56
.then(function() {
  log(56, 'mouseOverElement "Get quote"');
  return $browser.waitForAndFindElement(By.linkText("Get quote"), DefaultTimeout); })
.then(function (el) { $browser.actions().mouseMove(el).perform(); })


// Step 57
.then(function() {
  log(57, 'clickElement "Get quote"');
  return $browser.waitForAndFindElement(By.linkText("Get quote"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 45
.then(function() {
  log(45, 'clickElement "accomCheckout"');
  return $browser.waitForAndFindElement(By.id("accomCheckout"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 29
.then(function () {
  log(29, 'verifyTextPresent "I have read this back to the Customer"');
  $browser.findElement(By.tagName('body')).getText().then(function (text) { return text.indexOf("I have read this back to the Customer") != -1; }).then(function (bool) {
    if (!bool) {
      console.log('verifyTextPresent FAILED.');
      $browser.takeScreenshot();
    } else {
      console.log('verifyTextPresent SUCCEEDED.');
    }
  });
})


// Step 13
.then(function() {
  log(13, 'mouseOverElement "errataModalChkBox"');
  return $browser.waitForAndFindElement(By.id("errataModalChkBox"), DefaultTimeout); })
.then(function (el) { $browser.actions().mouseMove(el).perform(); })

// Step 46
.then(function() {
  log(46, 'setElementSelected "errataModalChkBox"');
  return $browser.waitForAndFindElement(By.id("errataModalChkBox"), DefaultTimeout); })
.then(function(el) { el.isSelected()
  .then(function(bool) { if (!bool) { el.click(); } }); })

// Step 47
.then(function() {
  log(47, 'clickElement "errataModalCheckOutBtn"');
  return $browser.waitForAndFindElement(By.id("errataModalCheckOutBtn"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 48
.then(function () {
  log(48, 'verifyTextPresent "RECOMMENDED FLIGHT AND HOLIDAY EXTRAS"');
  $browser.findElement(By.tagName('body')).getText().then(function (text) { return text.indexOf("RECOMMENDED FLIGHT AND HOLIDAY EXTRAS") != -1; }).then(function (bool) {
    if (!bool) {
      console.log('verifyTextPresent FAILED.');
      $browser.takeScreenshot();
    } else {
      console.log('verifyTextPresent SUCCEEDED.');
    }
  });
})

.then(function() {
  log(lastStep, '');
  console.log('Browser script execution SUCCEEDED.');
  $browser.takeScreenshot();
}, function(err) {
  console.log ('Browser script execution FAILED.');
  $browser.takeScreenshot();
  throw(err);
});

/** END OF SCRIPT **/
