Feature: Allow users to login and logout

  As a user of the telescope
  I want to login and logout
  So that I can prove my identity and see personalized data

  Background:
    Given I am signed out

  Scenario: A user can login with valid information
    Given I am on the home page
    When I click on sign in link
    And I enter my authentication information
    Then I should be logged in

  Scenario: A user cannot login with bad information
    Given I am on the home page
    When I click on sign in link
    And I enter incorrect authentication information
    Then I should see a user not found error
