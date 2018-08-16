<#
    .SYNOPSIS
	This script is used to deploy App Service Plan & Websites.

	.DESCRIPTION
	The script will ask the user for various parameters and then depending on them, it will deploy those app service plan and websites. The script supports the following scenarios -
		1. Deploy a new app service plan & a single website in it.
		2. Deploy a new app service plan & multiple websites in it.
		3. Deploy single web site to an existing App Service Plan
		4. Deploy multiple web sites to an existing App Service Plan.

	The script does not support deployment of multiple app service plans. If you would like to deploy multiple app service plans, run the script multiple times.

	.NOTES
		
		Author -- Pranav V Jituri (AIS)
        Last Revision -- 16th August 2018
        
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][string]$AppServicePlanName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][string]$Tier,
    [Parameter(Mandatory=$true)][string]$Sku,
    [Parameter(Mandatory=$true)][string]$WebAppNames
)

#Set ErrorAction to ensure that the script stops on error and not keep on proceeding ahead...
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Start-AzWebAppDeployment{
    <#
	.SYNOPSIS
	This function is used to deploy the Azure App Service Plan & Websites.

    .PARAMETER AzureCredentials
    This parameter accepts a PSCredential object which is used to authenticate with Azure to deploy resources.

	.PARAMETER Region
	The Data center location where the resources need to be deployed.

	.PARAMETER WebAppNameList
	This parameter is used to deploy all of the websites inside the app service plan. To deploy multiple websites, simply separate the names of the websites with commas. For example red,blue,green etc.

	.PARAMETER Sku
	This parameter determines the Sku for the app service plan. Acceptable values are -
		1. b1
        2. b2
        3. b3
        4. s1
        5. s2
        6. s3
        7. p1
        8. p2
        9. p3
        10. p1v2
        11. p2v2
        12. p3v2

	.PARAMETER Tier
	This parameter determines the Tier for the app service plan. Ensure that the entered value corresponds to the SKU entered otherwise the script will fail. Acceptable values are -
		1. Basic
		2. Standard
		3. Premium

	.PARAMETER ApplicationEnvironmentCode
	This parameter is used to determine the environment category for the application. Acceptable values are as below -
		1. D
		2. P
		3. R
		4. S
		5. T
		6. U

    .PARAMETER DeploymentSubscriptionId
    This parameter tells the script in which subscription to deploy the resources.

    .PARAMETER DeploymentResourceGroupName
    This parameter tells the script in which resource group inside the subscription, the resources need to be deployed.

    .PARAMETER AzureCredentials
    This parameter accepts a PSCredential object containing the credentials to log into the Azure Subscription.
	
	#>
[cmdletbinding()] 
param(
    [Parameter(Mandatory=$true)][string]$DeploymentSubscriptionId,
    [Parameter(Mandatory=$true)][string]$DeploymentResourceGroupName,
    [Parameter(Mandatory=$true)][pscredential]$AzureCredentials,
    [Parameter(Mandatory=$false)][string]$AppServicePlanName,
    [Parameter(Mandatory=$true)][string]$Region,
    [Parameter(Mandatory=$true)][string]$Sku,
    [Parameter(Mandatory=$true)][string]$Tier,
    [Parameter(Mandatory=$true)][string]$WebAppNameList
) 

Write-Verbose "[Start]:: Start-AzWebAppDeployment"

try{

    #Login to Azure and return Context. Azure subscription is hardcoded right now.
    Write-Verbose "[Info]:: Logging into Azure Subscription"
    $azureSubscriptionLogin = Login-AzureRmAccount -Credential $AzureCredentials -Subscription $DeploymentSubscriptionId -ErrorAction Stop
    Write-Verbose "[Info]:: Azure Subscription found -- "
    Write-Verbose ($azureSubscriptionLogin | Out-String)
    
    #Check if Resource Group in which deployment needs to take place exists or not.
    $azureResourceGroups = Get-AzureRmResourceGroup | Select-Object -Property 'ResourceGroupName' | Where-Object { $_.ResourceGroupName -eq $DeploymentResourceGroupName}
    if (!$azureResourceGroups) {
        throw "[Error]:: Unable to find resource group $DeploymentResourceGroupName for deployment. Ensure that application has been onboarded."
    } #end if
    Write-Verbose "[Info]:: Deployment Resource Group -- [$DeploymentResourceGroupName] -- found in Azure Subscription"

    # Construct Array for Web Apps from CSV List
    [array]$webAppsArray = $WebAppNameList -split ","

    #Construct the Template Parameter Object
    $appServicePlanTemplateParametersObject = @{
        "AppServicePlanName" = $AppServicePlanName
        "WebAppNames" = $webAppsArray;
        "Region" = $Region;
        "Sku" = $Sku;
        "Tier" = $Tier;
    }
    Write-Verbose "[Info]:: ARM Template Deployment Parameters -- "
    Write-Verbose ($appServicePlanTemplateParametersObject | Out-String)

    #Deployment Name Generation.
    $appServicePlanTemplateDeploymentName = "Az-WebApp-" + (((Get-Date).ToUniversalTime()).ToString('MMddyyyy-HHmmss'))
    Write-Verbose "[Info]:: Azure Deployment Name Set as -- $appServicePlanTemplateDeploymentName"
    
    #Deploy-AzWebAppTemplate.
    Write-Verbose "[Info]:: Starting Azure Template Deployment"
    $appServicePlanDeployment = New-AzureRmResourceGroupDeployment -Name $appServicePlanTemplateDeploymentName `
                                        -ResourceGroupName $deploymentResourceGroupName `
                                        -Mode "Incremental" `
                                        -TemplateFile "AzWebApp.Template.json" `
                                        -TemplateParameterObject $appServicePlanTemplateParametersObject `
                                        -Force -ErrorAction Stop -Verbose
    Write-Verbose "[Info]:: Azure Template Deployment Complete -- "
    Write-Verbose ($appServicePlanDeployment | Out-String)

    $outputHashTable = @{}
    $webAppArrayList = New-Object System.Collections.ArrayList
    foreach ($webApp in $webAppsArray) {
        $webAppArrayList.Add(@{"siteName" = $webApp ;"url" = ("https://" + $webApp + ".azurewebsites.net")}) | Out-Null
    }
    $outputHashTable.Add("sites",$webAppArrayList)
    $outputHashTable | ConvertTo-Json -Depth 10

} #end try
catch{
    Write-Warning -Message "Caught an exception:"
    Write-Warning -Message "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Error -Message "Exception Message: $($_.Exception.Message)"
} #end catch
Write-Verbose "[End]:: Start-AzDeployment"
} #end function Start-AzDeployment

Start-AzWebAppDeployment -DeploymentSubscriptionId $DeploymentSubscriptionId `
                        -DeploymentResourceGroupName $DeploymentResourceGroupName `
                        -AzureCredentials (Get-Credential -Message "Please Enter your credentials to login to Azure Subscription") `
                        -AppServicePlanName $AppServicePlanName `
                        -Region $Region `
                        -Sku $Sku `
                        -Tier $Tier `
                        -WebAppNameList $WebAppNames `
                        -Verbose