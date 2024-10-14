package config

import (
	"fmt"
	"os"

	"github.com/subosito/gotenv"
)

type Config struct {
	MODE     string `mapstructure:"MODE"`
	DB_URL   string `mapstructure:"DB_URL"`
	HTTPPort string `mapstructure:"HTTP_PORT"`
}

func LoadConfig() (*Config, error) {
	// viper.SetConfigFile("./config/config.yaml")
	// // viper.SetConfigFile("/go/src/app/config/config.yaml")

	// if err := viper.ReadInConfig(); err != nil {
	// 	return nil, fmt.Errorf("failed to read config file: %w", err)
	// }

	// var Config Config
	// if err := viper.Unmarshal(&Config); err != nil {
	// 	return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	// }

	// log.Printf("Config: %+v", Config)

	err := gotenv.Load(".env")
	if err != nil {
		fmt.Printf("failed to load env file: %v", err)
	}

	db_url, _ := os.LookupEnv("DB_URL")
	mode, _ := os.LookupEnv("MODE")
	http_port, _ := os.LookupEnv("HTTP_PORT")

	Config := Config{
		// MODE:     "dev",
		MODE:     mode,
		DB_URL:   db_url,
		HTTPPort: http_port,
	}
	fmt.Printf("%+v", Config)
	return &Config, nil
}
