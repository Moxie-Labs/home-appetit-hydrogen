# Overview

Home Appétit is a project comprised of two interoperating modules: the Marketing layer, and the Hydrogen layer.  The Marketing layer operates on Shopify, and is hosted at `marketingbeta.homeappetitphilly.com`.  The Hydrogen layer operates on Netlify, and is hosted at `orderbeta.homeappetitphilly.com`.  This documentation pertains to the Hydrogen layer, herein referred to as "HA-H"

----

## Project Setup

The Hydrogen layer operates as a React application using Vite file-based routing.  The project is confirmed to run on Node v17.4.0.   While most changes are reflected immediately - CSS changes are reflected without reload - but you may need to restart the server for certain changes, such as changes to the environment.

You can install the dependencies with the either: 

`npm i` or `yarn`

Then, you can start the local server with: 

`npm run dev` or `yarn dev`.

HA-H requires an `.env` file to be setup in the root directory to operate.  You can create your own using the included `.env.example` file:

> `VITE_STORE_DOMAIN`
The domain of the associated Marketing layer on Shopify.

> `VITE_STORE_TOKEN`
The Storefront API access token, provided by Shopify

> `VITE_STORE_MARKETING_SITE`
The website URL for the Marketing layer.  Usually identical to the Store Domain value.

> `VITE_ORDERING_SITE`
The domain of the associated Hydrogen instance on Netlify.

> `VITE_REFERRAL_APP_URL`
The domain of the Referral API server instance on Render.

> `VITE_SHOW_DEBUG`
Boolean that determines if `logToConsole` statements and a main Debug Value component loads.

----

## Deployment

HA-H can be deployed to Netlify (or another Node server partner) using GitHub deploys.  The project itself has been modified to build itself via Edge Functions.  Ensure the following configurations are set: 

	• Base directory: Not set
	• Build command: `yarn build`
	• Publish directory: `dist/client`
	• Deploy log visibility: `Logs are public`
	• Build status: `Active`
	• Branches: either `Main` or a `Sprint` branch

You will also need to generate an environment variable for each of the above variables.  It is recommend that you clear cache when deploying major changes, or changes to the environment.

----

## Basic Design Principles

HA-H follows much of the recommended design principles outlined in the official Hydrogen documentation, as of v1.6.5.  The following general principles should be kept in mind:

	• Vite files are either for server-side, client-side, or a dependency, as reflected in the file extension
	• Server-side files run when the route is first visited, and can run direct calls to the Storefront API
	• Client-side files are loaded within the server-side files and inherit the loaded data as props
	• Dependencies can be referenced in either file type, and are primarily used for storing constant values
	• Session data is stored in a cookie value called `__session
	• Unlike the Marketing site, HA-H uses a `CustomerAccessToken` to determine whether a user is signed in, and what account information to pull from the API e.g. Orders, Email Address
	• Admin and Storefront API calls use GraphQL queries
	• You can test Storefront API queries using the editor at `<localhost>/graphql`
----

## The Order Page

The Order page is the heart of the project.  Customers can select a plan, various items,  create a Cart, and advance to Checkout. 

`order/index.server.jsx` prepares the latest Menu information using a sequence of queries.  Menus provide a list of Products and their associated values, including Customization and Substitution Products.  It also determines the Availability Window, and the Delivery Date.  Separately, CustomerData is loaded using the `CustomerAccessToken` (if present).  This Menu and CustomerData information is piped into `OrderSection.client.jsx` as Props.

`OrderSection` is the parent component, and stores most of the State data passed to its Children as Props.  The following child components live within this parent: 
	• DebugValues: presents a variety of useful information at the top of the page; does not render unless `VITE_SHOW_DEBUG` is set to `true`
	• OrderProperties: sets the OrderType to either `Classic` or `Flexible`, and the total `PersonCount`
	• MenuSection: a container for each type of available Products, i.e. Entrées, Small Plates, and Add-ons
	• OrderSummary: contains a list of Product currently in the Cart, its price, and its modifications
	• DeliveryInfo: contains the Shipping information for the Order, including previous addresses
	• DeliveryWindow: determines which preferred hour-block to delivery the Order; the available blocks are determined by the ZIP code value in `DeliveryInfo`
	• OrderConfirmation: (unused) show the final status of the Order
	
`OrderSection` uses several callback methods to communicate with the Storefront API, as provided by the `CartProvider` context: 

	• `cartId`: grabs the ID of the current Cart
	• `checkoutUrl`: provides the Shopify Checkout page URL used for redirecting after confirming the Order
	• `cartStatus`: provides whether the Cart is being updated or can be updated
	• `linesAdd`: adds one or more LineItems to the current Cart
	• `linesRemove`: removes one or more LineItems to the current Cart
	• `linesUpdate`: updates a given LineItem
	• `cartLines`: provides all the LineItems within the current Cart
	• `cartAttributesUpdate`: updates custom data to the current Cart, used for store OrderType, DeliveryWindow, and Gift status
	• `buyerIdentityUpdate`: updates information related to the Customer
	• `noteUpdate`: updates the Delivery Instructions value

`OrderSection` uses a State value `currentStep` to determine what to render for each Step.  Each component has a `step`, and knows what to show when the `currentStep` is lower than, equal to, or greater than its `step`.  You can navigate throughout the Order process by setting the `step` value.

Shopify handles the Checkout and Order Confirmation steps once `OrderSection` prepares the Cart.

----

## The Gift Card Page

The Gift Card page functions similarly to the `OrderSection`, and uses the same Shopify callbacks.  As a result, the Cart needs to be cleared when navigating between these pages, as Gift Cards cannot be purchases alongside an Order, and vice versa.  Most of the code lives in `GiftCard/GiftCardCalculator.client.jsx`.

The `giftCardAmount` value determines which Product and Variant to select when advancing to Checkout.

----

## The Account Page

The Account page requires the `customerAccessToken` to be set by signing in via the Marketing site.  `routes/account/index.server.jsx` pulls the related Customer information using the `customerAccessToken`, before passing those values to `components/MyAccount.client.jsx`.  `MyAccount` houses the `PersonalInfo`, `Orders`, and `Referrals` tabs.
